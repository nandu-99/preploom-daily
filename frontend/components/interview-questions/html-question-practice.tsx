"use client";

import type { InterviewQuestion } from "@/content/interview-questions/types";
import { QuestionToolbar } from "@/components/interview-questions/question-toolbar";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type StudyMode = "practice" | "test";

function Answer({ question }: { question: InterviewQuestion }) {
  return (
    <div className="min-w-0 space-y-4">
      <p className="break-words text-[14px] leading-7 text-[#383838] [overflow-wrap:anywhere] dark:text-[#c9c9c9] sm:text-[15px]">
        {question.answer}
      </p>

      {question.points && (
        <ul className="grid gap-2">
          {question.points.map((point) => (
            <li
              key={point}
              className="grid grid-cols-[14px_minmax(0,1fr)] gap-2 text-[13px] leading-6 text-[#505050] dark:text-[#b8b8b8]"
            >
              <span
                aria-hidden="true"
                className="mt-[11px] h-px bg-black/35 dark:bg-white/35"
              />
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}

      {question.code && (
        <pre className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-[10px] border border-black/[0.08] bg-[#e7e7e4] p-3 text-[12px] leading-6 text-[#383838] dark:border-white/[0.1] dark:bg-[#292929] dark:text-[#e1e1e1] sm:p-4">
          <code className="block min-w-max">{question.code}</code>
        </pre>
      )}

      {question.note && (
        <p className="break-words border-l-2 border-black/20 pl-4 text-[12px] leading-6 text-[#606060] [overflow-wrap:anywhere] dark:border-white/20 dark:text-[#a8a8a8]">
          {question.note}
        </p>
      )}
    </div>
  );
}

export function QuestionPractice({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  const [mode, setMode] = useState<StudyMode>("practice");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    () => new Set(),
  );

  function selectMode(nextMode: StudyMode) {
    setMode(nextMode);
    if (nextMode === "test") {
      setRevealedAnswers(new Set());
    }
  }

  function toggleAnswer(id: string) {
    setRevealedAnswers((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="min-w-0">
      <QuestionToolbar
        filteredCount={questions.length}
        totalCount={questions.length}
        mode={mode}
        modeOptions={[
          { id: "practice", label: "Practice", icon: BookOpen },
          { id: "test", label: "Test", icon: EyeOff },
        ]}
        onModeChange={selectMode}
      />

      <div className="grid min-w-0 gap-3">
        {questions.map((question, index) => {
          const answerVisible =
            mode === "practice" || revealedAnswers.has(question.id);

          return (
            <article
              key={question.id}
              id={question.id}
              className="min-w-0 scroll-mt-[170px] overflow-hidden rounded-[12px] border border-black/[0.09] bg-white/45 px-4 py-5 dark:border-white/[0.1] dark:bg-[#111] sm:px-5"
            >
              <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:grid-cols-[38px_minmax(0,1fr)_auto] sm:gap-4">
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] leading-6 text-[#777] dark:text-[#858585]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="min-w-0 break-words text-[16px] font-semibold leading-6 tracking-[-0.025em] [overflow-wrap:anywhere] sm:text-[17px]">
                  {question.question}
                </h3>

                {mode === "test" && (
                  <button
                    type="button"
                    onClick={() => toggleAnswer(question.id)}
                    aria-expanded={answerVisible}
                    className="col-start-2 inline-flex h-8 w-fit items-center gap-2 rounded-[8px] px-2 text-[11px] font-medium text-[#606060] transition-colors hover:bg-black/[0.04] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50 sm:col-start-3 sm:row-start-1"
                  >
                    {answerVisible ? (
                      <EyeOff
                        className="size-3.5"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="size-3.5"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    )}
                    {answerVisible ? "Hide answer" : "Reveal answer"}
                  </button>
                )}
              </div>

              {answerVisible && (
                <div className="mt-4 min-w-0 border-t border-black/[0.08] pt-4 dark:border-white/[0.09] sm:ml-[54px]">
                  <Answer question={question} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
