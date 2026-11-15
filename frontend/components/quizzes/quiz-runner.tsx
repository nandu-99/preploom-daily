"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { QuizDefinition } from "@/content/quizzes";

type QuizPhase = "intro" | "quiz" | "results";
type QuizMode = "practice" | "test";

type SavedQuiz = {
  phase: QuizPhase;
  mode: QuizMode;
  currentIndex: number;
  answers: Record<string, string>;
  startedAt: number | null;
  elapsedSeconds: number;
};

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function QuizRunner({ quiz }: { quiz: QuizDefinition }) {
  const storageKey = `preploom-quiz-${quiz.slug}`;
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [mode, setMode] = useState<QuizMode>("test");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savedQuiz, setSavedQuiz] = useState<SavedQuiz | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [correctOptionIds, setCorrectOptionIds] = useState<
    Record<string, string>
  >({});
  const [reviewDetails, setReviewDetails] = useState<
    Record<string, { explanation: string; keyPoint: string }>
  >({});
  const [gradeError, setGradeError] = useState("");

  const currentQuestion = quiz.questions[currentIndex];
  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = quiz.questions.length - answeredCount;
  const timeLimitSeconds = quiz.timeLimitMinutes * 60;
  const remainingSeconds = Math.max(0, timeLimitSeconds - elapsedSeconds);

  const score = useMemo(
    () =>
      quiz.questions.reduce(
        (total, question) =>
          total +
          (correctOptionIds[question.id] !== undefined &&
          answers[question.id] === correctOptionIds[question.id]
            ? 1
            : 0),
        0,
      ),
    [answers, correctOptionIds, quiz.questions],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as SavedQuiz;
          if (parsed.phase !== "intro") setSavedQuiz(parsed);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated || phase === "intro") return;
    const snapshot: SavedQuiz = {
      phase,
      mode,
      currentIndex,
      answers,
      startedAt,
      elapsedSeconds,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  }, [
    answers,
    currentIndex,
    elapsedSeconds,
    hydrated,
    mode,
    phase,
    startedAt,
    storageKey,
  ]);

  const gradeAnswers = useCallback(
    async (submittedAnswers: Record<string, string>) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
      const response = await fetch(
        `${backendUrl}/quizzes/${encodeURIComponent(quiz.slug)}/grade`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ answers: submittedAnswers }),
        },
      );
      if (!response.ok)
        throw new Error("Unable to grade the quiz. Please try again.");
      const body = (await response.json()) as {
        data: {
          correctOptionIds: Record<string, string>;
          reviewDetails: Record<
            string,
            { explanation: string; keyPoint: string }
          >;
        };
      };
      setCorrectOptionIds(body.data.correctOptionIds);
      setReviewDetails(body.data.reviewDetails);
    },
    [quiz.slug],
  );

  const finishQuiz = useCallback(async () => {
    try {
      setGradeError("");
      await gradeAnswers(answers);
    } catch (error) {
      setGradeError(
        error instanceof Error ? error.message : "Unable to grade the quiz.",
      );
      return;
    }
    if (startedAt !== null) {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
      );
    }
    setSubmitOpen(false);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [answers, gradeAnswers, startedAt]);

  useEffect(() => {
    if (phase !== "quiz" || startedAt === null) return;
    const updateTime = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      setElapsedSeconds(elapsed);
      if (mode === "test" && elapsed >= timeLimitSeconds) finishQuiz();
    };
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, [finishQuiz, mode, phase, startedAt, timeLimitSeconds]);

  const startQuiz = useCallback(
    (selectedMode: QuizMode = mode) => {
      setMode(selectedMode);
      setPhase("quiz");
      setCurrentIndex(0);
      setAnswers({});
      setCorrectOptionIds({});
      setReviewDetails({});
      setGradeError("");
      setStartedAt(Date.now());
      setElapsedSeconds(0);
      setSavedQuiz(null);
    },
    [mode],
  );

  const resumeQuiz = useCallback(async () => {
    if (!savedQuiz) return;
    if (savedQuiz.phase === "results") {
      try {
        await gradeAnswers(savedQuiz.answers);
      } catch {
        setGradeError("Unable to load quiz results.");
        return;
      }
    }
    setPhase(savedQuiz.phase);
    setMode(savedQuiz.mode ?? "test");
    setCurrentIndex(savedQuiz.currentIndex);
    setAnswers(savedQuiz.answers);
    setStartedAt(
      savedQuiz.phase === "quiz"
        ? Date.now() - savedQuiz.elapsedSeconds * 1000
        : savedQuiz.startedAt,
    );
    setElapsedSeconds(savedQuiz.elapsedSeconds);
  }, [gradeAnswers, savedQuiz]);

  const restartQuiz = () => {
    window.localStorage.removeItem(storageKey);
    startQuiz(mode);
  };

  const moveQuestion = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), quiz.questions.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [quiz.questions.length],
  );

  useEffect(() => {
    if (phase !== "quiz") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("button, a, input")) return;
      const optionIndex = Number(event.key) - 1;
      if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
        setAnswers((current) => ({
          ...current,
          [currentQuestion.id]: currentQuestion.options[optionIndex].id,
        }));
      }
      if (
        event.key === "ArrowRight" &&
        currentIndex < quiz.questions.length - 1
      ) {
        moveQuestion(currentIndex + 1);
      }
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        moveQuestion(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    currentIndex,
    currentQuestion,
    moveQuestion,
    phase,
    quiz.questions.length,
  ]);

  if (!quiz.questions.length) {
    return (
      <main className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-6 lg:px-8">
        <p className="text-sm text-[#666] dark:text-[#aaa]">Quiz unavailable</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Questions are being prepared.
        </h1>
        <Link
          className="mt-8 inline-flex text-sm font-medium underline"
          href={quiz.subjectHref}
        >
          Return to {quiz.subject}
        </Link>
      </main>
    );
  }

  if (phase === "intro") {
    return (
      <>
        <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1240px] items-center px-5 py-14 sm:px-6 lg:px-8">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-24">
            <div className="max-w-[720px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#666] dark:text-[#aaa]">
                {quiz.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.065em]">
                {quiz.title}
              </h1>
              <p className="mt-7 max-w-[640px] text-pretty text-base leading-7 text-[#5e5e5e] dark:text-[#aaa] sm:text-lg sm:leading-8">
                {quiz.description}
              </p>
              <div className="mt-9 flex flex-wrap gap-2">
                {[
                  `${quiz.questions.length} questions`,
                  `${quiz.timeLimitMinutes} min test`,
                  "Results at the end",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-black/[0.025] px-3 py-1.5 text-xs font-medium text-[#555] dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#bbb]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {savedQuiz && (
                  <button
                    type="button"
                    onClick={resumeQuiz}
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#151515] px-5 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
                  >
                    Continue {savedQuiz.mode ?? "test"}{" "}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (savedQuiz) {
                      window.localStorage.removeItem(storageKey);
                      setSavedQuiz(null);
                    }
                    setModeOpen(true);
                  }}
                  className={`inline-flex h-11 items-center gap-2 rounded-[10px] px-5 text-sm font-medium ${savedQuiz ? "border border-black/10 hover:bg-black/[0.04] dark:border-white/[0.12] dark:hover:bg-white/[0.06]" : "bg-[#151515] text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"}`}
                >
                  {savedQuiz ? "Start new quiz" : "Start quiz"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
                <Link
                  href={quiz.subjectHref}
                  className="inline-flex h-11 items-center px-2 text-sm font-medium text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white"
                >
                  View subject notes
                </Link>
              </div>
            </div>

            <aside className="border-t border-black/10 pt-6 dark:border-white/[0.12] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm font-medium">Before you begin</p>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[#666] dark:text-[#aaa]">
                <li>Choose timed test or untimed practice.</li>
                <li>Jump between questions and change answers.</li>
                <li>See correct answers only after you submit.</li>
              </ul>
            </aside>
          </div>
        </main>
        <ModeDialog
          open={modeOpen}
          onOpenChange={setModeOpen}
          mode={mode}
          onModeChange={setMode}
          timeLimitMinutes={quiz.timeLimitMinutes}
          onStart={() => {
            setModeOpen(false);
            startQuiz(mode);
          }}
        />
      </>
    );
  }

  if (phase === "results") {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <main className="mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#666] dark:text-[#aaa]">
            {mode} complete
          </p>
          <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.065em]">
            {score} out of {quiz.questions.length}
          </h1>
          <p className="mt-5 text-base leading-7 text-[#666] dark:text-[#aaa]">
            {percentage >= 80
              ? "Strong result. Review the details below to lock it in."
              : percentage >= 60
                ? "You know the core ideas. Review the questions you missed."
                : "Go through the answers below before trying again."}
          </p>

          <div className="mt-9 grid grid-cols-3 border-y border-black/10 py-6 dark:border-white/[0.12]">
            <ResultStat label="Correct" value={String(score)} />
            <ResultStat
              label="Incorrect"
              value={String(quiz.questions.length - score)}
              bordered
            />
            <ResultStat
              label={mode === "test" ? "Time used" : "Study time"}
              value={formatTime(
                mode === "test"
                  ? Math.min(elapsedSeconds, timeLimitSeconds)
                  : elapsedSeconds,
              )}
            />
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={restartQuiz}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#151515] px-5 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Try again
            </button>
            <Link
              href={quiz.subjectHref}
              className="inline-flex h-11 items-center px-3 text-sm font-medium text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white"
            >
              Return to {quiz.subject}
            </Link>
          </div>

          <section className="mt-16" aria-labelledby="answer-review-title">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#777] dark:text-[#999]">
              Answer review
            </p>
            <h2
              id="answer-review-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
            >
              Every question, explained.
            </h2>
            <div className="mt-8 divide-y divide-black/10 border-y border-black/10 dark:divide-white/[0.12] dark:border-white/[0.12]">
              {quiz.questions.map((question, questionIndex) => {
                const selectedId = answers[question.id];
                const isCorrect = selectedId === correctOptionIds[question.id];
                return (
                  <article key={question.id} className="py-9 sm:py-11">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2
                          className="mt-1 size-5 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircle
                          className="mt-1 size-5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <p className="text-xs text-[#777] dark:text-[#999]">
                          Question {questionIndex + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold leading-7 tracking-[-0.025em] sm:text-2xl sm:leading-8">
                          {question.prompt}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-2">
                      {question.options.map((option) => {
                        const correct =
                          option.id === correctOptionIds[question.id];
                        const selected = option.id === selectedId;
                        return (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 text-sm ${correct ? "border-black/35 bg-black/[0.06] font-medium dark:border-white/40 dark:bg-white/[0.1]" : selected ? "border-black/20 bg-black/[0.025] dark:border-white/20 dark:bg-white/[0.04]" : "border-black/[0.07] text-[#777] dark:border-white/[0.08] dark:text-[#888]"}`}
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center">
                              {correct ? (
                                <Check
                                  className="size-4"
                                  aria-label="Correct option"
                                />
                              ) : selected ? (
                                <X
                                  className="size-4"
                                  aria-label="Your incorrect option"
                                />
                              ) : null}
                            </span>
                            <span>{option.label}</span>
                            {correct && (
                              <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.1em]">
                                Correct
                              </span>
                            )}
                            {selected && !correct && (
                              <span className="ml-auto text-[11px] text-[#777] dark:text-[#999]">
                                Your answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {!selectedId && (
                      <p className="mt-3 text-xs font-medium text-[#777] dark:text-[#999]">
                        You did not answer this question.
                      </p>
                    )}
                    <p className="mt-6 text-sm leading-7 text-[#555] dark:text-[#b3b3b3]">
                      {reviewDetails[question.id]?.explanation}
                    </p>
                    <p className="mt-4 border-l-2 border-black/25 pl-4 text-sm font-medium leading-6 dark:border-white/30">
                      Remember: {reviewDetails[question.id]?.keyPoint}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100svh-68px)] w-full max-w-[1240px] flex-col overflow-hidden px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="shrink-0 flex items-start justify-between gap-5 border-b border-black/10 pb-4 dark:border-white/[0.12]">
        <div>
          <p className="text-xs capitalize text-[#777] dark:text-[#999]">
            {quiz.subject} · {mode} mode
          </p>
          <p className="mt-1 text-sm font-medium">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {mode === "test" ? (
            <span
              className={`flex items-center gap-1.5 text-sm font-medium tabular-nums ${remainingSeconds <= 60 ? "text-[#222] dark:text-white" : "text-[#666] dark:text-[#aaa]"}`}
              aria-label={`${formatTime(remainingSeconds)} remaining`}
            >
              <Clock3 className="size-4" aria-hidden="true" />{" "}
              {formatTime(remainingSeconds)}
            </span>
          ) : (
            <span className="hidden text-xs text-[#777] dark:text-[#999] sm:block">
              Untimed
            </span>
          )}
          <button
            type="button"
            onClick={() => setExitOpen(true)}
            className="rounded-lg p-2 text-[#777] hover:bg-black/[0.05] hover:text-black dark:text-[#999] dark:hover:bg-white/[0.07] dark:hover:text-white"
            aria-label="Leave quiz"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 h-1 shrink-0 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-[#202020] transition-[width] duration-300 dark:bg-[#e5e5e3]"
          style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
        />
      </div>

      <section className="mx-auto mt-6 flex min-h-0 w-full max-w-[780px] flex-1 flex-col sm:mt-8">
        <fieldset
          key={currentQuestion.id}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6 pr-1 [scrollbar-gutter:stable]"
        >
          <legend className="text-balance text-2xl font-semibold leading-8 tracking-[-0.035em] sm:text-[32px] sm:leading-[1.2]">
            {currentQuestion.prompt}
          </legend>
          <div className="mt-7 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const selected = selectedOptionId === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-[12px] border px-4 py-3.5 text-sm leading-6 transition-colors focus-within:ring-2 focus-within:ring-black/35 dark:focus-within:ring-white/50 ${selected ? "border-black/35 bg-black/[0.045] dark:border-white/35 dark:bg-white/[0.08]" : "border-black/10 hover:border-black/25 hover:bg-black/[0.02] dark:border-white/[0.12] dark:hover:border-white/25 dark:hover:bg-white/[0.04]"}`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={selected}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [currentQuestion.id]: option.id,
                      }))
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${selected ? "border-[#222] bg-[#222] text-white dark:border-[#ededeb] dark:bg-[#ededeb] dark:text-[#111]" : "border-black/15 text-[#777] dark:border-white/[0.16] dark:text-[#aaa]"}`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <nav
          className="shrink-0 border-t border-black/10 pt-4 dark:border-white/[0.12]"
          aria-label="Quiz questions"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => moveQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="inline-flex h-10 items-center gap-2 rounded-[9px] px-2 text-sm font-medium text-[#666] hover:text-black disabled:pointer-events-none disabled:opacity-30 dark:text-[#aaa] dark:hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Previous
            </button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => moveQuestion(currentIndex + 1)}
                className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#151515] px-5 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
              >
                Next question{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#151515] px-5 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
              >
                Submit quiz <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-black/[0.07] pt-4 dark:border-white/[0.09]">
            {quiz.questions.map((question, index) => {
              const answered = Boolean(answers[question.id]);
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => moveQuestion(index)}
                  aria-label={`Go to question ${index + 1}${answered ? ", answered" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex size-9 items-center justify-center rounded-[9px] border font-mono text-xs transition-colors ${isCurrent ? "border-[#222] bg-[#222] text-white dark:border-[#ededeb] dark:bg-[#ededeb] dark:text-[#111]" : answered ? "border-black/25 bg-black/[0.045] dark:border-white/25 dark:bg-white/[0.07]" : "border-black/10 hover:border-black/25 dark:border-white/[0.12] dark:hover:border-white/25"}`}
                >
                  {answered && !isCurrent ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#777] dark:text-[#999]">
              {answeredCount} of {quiz.questions.length} answered
            </p>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="text-sm font-medium underline decoration-black/20 underline-offset-4 hover:decoration-black/60 dark:decoration-white/25 dark:hover:decoration-white/60"
            >
              Submit quiz
            </button>
            {gradeError ? (
              <span
                role="alert"
                className="text-xs text-red-700 dark:text-red-400"
              >
                {gradeError}
              </span>
            ) : null}
          </div>
        </nav>
      </section>

      <ExitDialog
        open={exitOpen}
        onOpenChange={setExitOpen}
        subjectHref={quiz.subjectHref}
      />
      <SubmitDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        unansweredCount={unansweredCount}
        onSubmit={finishQuiz}
      />
    </main>
  );
}

function ModeDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  timeLimitMinutes,
  onStart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  timeLimitMinutes: number;
  onStart: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex items-center justify-center p-5">
          <Dialog.Popup className="w-full max-w-[460px] rounded-[16px] border border-black/10 bg-[#f7f7f5] p-6 font-[family-name:var(--font-geist-sans)] text-[#151515] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-[opacity,transform] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white/[0.12] dark:bg-[#141414] dark:text-[#f3f3f1] sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <Dialog.Title className="text-xl font-semibold tracking-[-0.035em]">
                  Choose your mode
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-[#666] dark:text-[#aaa]">
                  Pick the pace that works for you. Answers appear only after
                  submission.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close mode selection"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-[#777] hover:bg-black/[0.05] hover:text-black dark:text-[#999] dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>

            <div className="mt-6 grid gap-3">
              <ModeCard
                active={mode === "test"}
                title="Test mode"
                detail={`${timeLimitMinutes} minute countdown. The quiz submits automatically when time ends.`}
                onClick={() => onModeChange("test")}
              />
              <ModeCard
                active={mode === "practice"}
                title="Practice mode"
                detail="No timer. Move at your own pace and submit when you are ready."
                onClick={() => onModeChange("practice")}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-black/10 pt-5 dark:border-white/[0.12]">
              <Dialog.Close className="h-10 rounded-[9px] px-4 text-sm font-medium text-[#666] hover:bg-black/[0.05] dark:text-[#aaa] dark:hover:bg-white/[0.07]">
                Cancel
              </Dialog.Close>
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#151515] px-4 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
              >
                Start {mode}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModeCard({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-[13px] border p-4 text-left transition-colors ${active ? "border-black/35 bg-black/[0.045] dark:border-white/35 dark:bg-white/[0.08]" : "border-black/10 hover:border-black/25 dark:border-white/[0.12] dark:hover:border-white/25"}`}
    >
      <span className="flex items-center justify-between gap-3 text-sm font-semibold">
        {title}
        <span
          className={`size-3 rounded-full border ${active ? "border-[#222] bg-[#222] ring-2 ring-[#f7f7f5] outline outline-1 outline-black/30 dark:border-[#ededeb] dark:bg-[#ededeb] dark:ring-[#0a0a0a] dark:outline-white/30" : "border-black/20 dark:border-white/20"}`}
        />
      </span>
      <span className="mt-2 block text-xs leading-5 text-[#666] dark:text-[#aaa]">
        {detail}
      </span>
    </button>
  );
}

function ResultStat({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`px-3 sm:px-7 ${bordered ? "border-x border-black/10 dark:border-white/[0.12]" : ""}`}
    >
      <p className="text-xs text-[#777] dark:text-[#999]">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function ExitDialog({
  open,
  onOpenChange,
  subjectHref,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectHref: string;
}) {
  return (
    <QuizDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Leave this quiz?"
      description="Your answers and timer are saved on this device. You can continue when you come back."
    >
      <Dialog.Close className="h-10 rounded-[9px] px-4 text-sm font-medium text-[#666] hover:bg-black/[0.05] dark:text-[#aaa] dark:hover:bg-white/[0.07]">
        Keep studying
      </Dialog.Close>
      <Link
        href={subjectHref}
        className="inline-flex h-10 items-center rounded-[9px] bg-[#151515] px-4 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
      >
        Leave quiz
      </Link>
    </QuizDialog>
  );
}

function SubmitDialog({
  open,
  onOpenChange,
  unansweredCount,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unansweredCount: number;
  onSubmit: () => void;
}) {
  const description =
    unansweredCount > 0
      ? `You still have ${unansweredCount} unanswered ${unansweredCount === 1 ? "question" : "questions"}. After submitting, you cannot change your answers.`
      : "You answered every question. After submitting, you cannot change your answers.";
  return (
    <QuizDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Submit your quiz?"
      description={description}
    >
      <Dialog.Close className="h-10 rounded-[9px] px-4 text-sm font-medium text-[#666] hover:bg-black/[0.05] dark:text-[#aaa] dark:hover:bg-white/[0.07]">
        Keep checking
      </Dialog.Close>
      <button
        type="button"
        onClick={onSubmit}
        className="h-10 rounded-[9px] bg-[#151515] px-4 text-sm font-medium text-white hover:bg-[#262626] dark:bg-[#ededeb] dark:text-[#111] dark:hover:bg-white"
      >
        Submit quiz
      </button>
    </QuizDialog>
  );
}

function QuizDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex items-center justify-center p-5">
          <Dialog.Popup className="w-full max-w-[420px] rounded-[16px] border border-black/10 bg-[#f7f7f5] p-6 font-[family-name:var(--font-geist-sans)] text-[#151515] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-[opacity,transform] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white/[0.12] dark:bg-[#141414] dark:text-[#f3f3f1]">
            <Dialog.Title className="text-lg font-semibold tracking-[-0.025em]">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-[#666] dark:text-[#aaa]">
              {description}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">{children}</div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
