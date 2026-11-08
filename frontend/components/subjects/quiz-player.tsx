"use client";

import type { Quiz } from "@/lib/subjects";
import { type FormEvent, useState } from "react";

type QuizResult = {
  score: number;
  total: number;
  results: {
    questionId: string;
    selectedOption: number;
    correctOption: number;
    correct: boolean;
    explanation: string | null;
  }[];
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export function QuizPlayer({
  quiz,
  subjectSlug,
}: {
  quiz: Quiz;
  subjectSlug: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (quiz.questions.some((question) => answers[question.id] === undefined)) {
      setError("Choose an answer for every question before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `${backendUrl}/subjects/${encodeURIComponent(subjectSlug)}/quizzes/${encodeURIComponent(quiz.slug)}/submit`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            answers: quiz.questions.map((question) => ({
              questionId: question.id,
              optionIndex: answers[question.id],
            })),
          }),
        },
      );
      const body = (await response.json()) as {
        data?: QuizResult;
        error?: { message: string };
      };
      if (!response.ok || !body.data) {
        setError(
          body.error?.message ?? "Unable to score this quiz. Please try again.",
        );
        return;
      }
      setResult(body.data);
    } catch {
      setError("The backend is unavailable. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitQuiz} className="max-w-[760px]">
      <div className="flex items-end justify-between gap-4 border-b border-black/[0.12] pb-5 dark:border-white/[0.13]">
        <h2 className="text-[20px] font-medium tracking-[-0.03em]">
          Questions
        </h2>
        <span className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#606060] dark:text-[#a8a8a8]">
          {quiz.questions.length} total
        </span>
      </div>

      {quiz.questions.map((question, index) => {
        const feedback = result?.results.find(
          (item) => item.questionId === question.id,
        );
        return (
          <fieldset
            key={question.id}
            className="border-b border-black/[0.09] py-8 dark:border-white/[0.1]"
          >
            <legend className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#777] dark:text-[#8f8f8f]">
              Question {String(index + 1).padStart(2, "0")}
            </legend>
            <p className="mt-3 whitespace-pre-wrap text-[20px] font-medium tracking-[-0.03em] sm:text-[22px]">
              {question.prompt}
            </p>
            <div className="mt-5 grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 text-[14px] leading-6 transition-colors ${answers[question.id] === optionIndex ? "border-black/40 bg-black/[0.05] dark:border-white/50 dark:bg-white/[0.08]" : "border-black/[0.1] hover:border-black/25 dark:border-white/[0.11] dark:hover:border-white/25"}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionIndex}
                    checked={answers[question.id] === optionIndex}
                    disabled={submitting || result !== null}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: optionIndex,
                      }))
                    }
                    className="size-4 shrink-0 accent-[#151515] dark:accent-white"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {feedback ? (
              <div
                className="mt-4 rounded-[10px] border border-black/[0.1] bg-black/[0.025] px-4 py-3 text-[13px] leading-6 dark:border-white/[0.11] dark:bg-white/[0.035]"
                role="status"
              >
                <p className="font-medium">
                  {feedback.correct
                    ? "Correct"
                    : `Incorrect. Correct answer: ${question.options[feedback.correctOption]}`}
                </p>
                {feedback.explanation ? (
                  <p className="mt-1 text-[#606060] dark:text-[#a8a8a8]">
                    {feedback.explanation}
                  </p>
                ) : null}
              </div>
            ) : null}
          </fieldset>
        );
      })}

      {error ? (
        <p
          role="alert"
          className="mt-5 text-[13px] text-red-800 dark:text-red-200"
        >
          {error}
        </p>
      ) : null}
      {result ? (
        <div
          className="mt-8 rounded-[14px] border border-black/[0.12] bg-black/[0.025] p-6 dark:border-white/[0.13] dark:bg-white/[0.035]"
          role="status"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#606060] dark:text-[#a8a8a8]">
            Your result
          </p>
          <p className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">
            {result.score} / {result.total}
          </p>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setResult(null);
              setError("");
            }}
            className="mt-5 rounded-[10px] border border-black/[0.12] px-4 py-2 text-[13px] font-medium dark:border-white/[0.13]"
          >
            Try again
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={submitting}
          className="mt-8 inline-flex h-11 items-center rounded-[10px] bg-[#151515] px-5 text-[13px] font-medium text-white disabled:opacity-50 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
        >
          {submitting ? "Checking answers..." : "Submit answers"}
        </button>
      )}
    </form>
  );
}
