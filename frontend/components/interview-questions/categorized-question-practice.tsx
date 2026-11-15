"use client";

import type { InterviewQuestion } from "@/content/interview-questions/types";
import { QuestionToolbar } from "@/components/interview-questions/question-toolbar";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type StudyMode = "learn" | "practice";
type CategorizedQuestion = InterviewQuestion & { category: string };

export function CategorizedQuestionPractice({
  questions,
  categories,
  categoryLabel,
}: {
  questions: CategorizedQuestion[];
  categories: readonly string[];
  categoryLabel: string;
}) {
  const [mode, setMode] = useState<StudyMode>("practice");
  const [category, setCategory] = useState("All questions");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    () => new Set(),
  );

  const categoryOptions = ["All questions", ...categories];
  const filteredQuestions =
    category === "All questions"
      ? questions
      : questions.filter((question) => question.category === category);

  function selectMode(nextMode: StudyMode) {
    setMode(nextMode);
    if (nextMode === "practice") {
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
        filteredCount={filteredQuestions.length}
        totalCount={questions.length}
        mode={mode}
        modeOptions={[
          { id: "learn", label: "Learn", icon: BookOpen },
          { id: "practice", label: "Practice", icon: EyeOff },
        ]}
        onModeChange={selectMode}
        categories={categoryOptions}
        selectedCategory={category}
        onCategoryChange={setCategory}
        categoryLabel={categoryLabel}
      />

      {filteredQuestions.length ? (
        <div className="grid min-w-0 gap-3">
          {filteredQuestions.map((question) => {
            const questionNumber = questions.findIndex(
              (item) => item.id === question.id,
            );
            const answerVisible =
              mode === "learn" || revealedAnswers.has(question.id);

            return (
              <article
                key={question.id}
                id={question.id}
                className="min-w-0 scroll-mt-[260px] overflow-hidden rounded-[12px] border border-black/[0.09] bg-white/45 px-4 py-5 dark:border-white/[0.1] dark:bg-[#111] sm:px-5"
              >
                <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:grid-cols-[38px_minmax(0,1fr)_auto] sm:gap-4">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[11px] leading-6 text-[#777] dark:text-[#858585]">
                    {String(questionNumber + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[10px] font-medium text-[#777] dark:text-[#858585]">
                      {question.category}
                    </p>
                    <h3 className="min-w-0 break-words text-[16px] font-semibold leading-6 tracking-[-0.025em] [overflow-wrap:anywhere] sm:text-[17px]">
                      {question.question}
                    </h3>
                  </div>

                  {mode === "practice" && (
                    <button
                      type="button"
                      onClick={() => toggleAnswer(question.id)}
                      aria-expanded={answerVisible}
                      className="col-start-2 mt-1 inline-flex h-8 w-fit items-center gap-2 rounded-[8px] px-2 text-[11px] font-medium text-[#606060] transition-colors hover:bg-black/[0.04] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50 sm:col-start-3 sm:row-start-1 sm:mt-0"
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
                    <p className="break-words text-[14px] leading-7 text-[#383838] [overflow-wrap:anywhere] dark:text-[#c9c9c9] sm:text-[15px]">
                      {question.answer}
                    </p>
                    {question.code && (
                      <pre className="mt-4 min-w-0 overflow-x-auto rounded-[10px] border border-black/[0.08] bg-[#151515] p-4 font-[family-name:var(--font-geist-mono)] text-[12px] leading-6 text-[#ededed] dark:border-white/[0.1] dark:bg-[#080808] sm:text-[13px]">
                        <code>{question.code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[12px] border border-black/[0.09] px-5 py-12 text-center dark:border-white/[0.1]">
          <p className="text-sm font-medium">No questions in this category.</p>
          <button
            type="button"
            onClick={() => setCategory("All questions")}
            className="mt-3 rounded-[8px] px-3 py-2 text-xs text-[#606060] underline decoration-black/25 underline-offset-4 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:decoration-white/25 dark:hover:text-white dark:focus-visible:ring-white/50"
          >
            Show all questions
          </button>
        </div>
      )}
    </div>
  );
}
