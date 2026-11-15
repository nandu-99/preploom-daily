import { InterviewHeroAnimation } from "@/components/interview-questions/interview-hero-animation";
import { QuestionPractice } from "@/components/interview-questions/html-question-practice";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getInterviewQuestions } from "@/lib/interview-questions";
import type { InterviewQuestion } from "@/content/interview-questions/types";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "React Interview Questions | PrepLoom",
  description:
    "Practice modern React interview questions with visible answers or test yourself before revealing each explanation.",
};

export const dynamic = "force-dynamic";

export default async function ReactInterviewQuestionsPage() {
  const reactInterviewQuestions = await getInterviewQuestions<InterviewQuestion>('react');
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-[#151515] selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-[#f3f3f1] dark:selection:text-[#151515]">
      <a
        href="#react-interview-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="react-interview-main">
        <section className="border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto grid min-w-0 max-w-[1240px] items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
            <div className="min-w-0">
              <Link
                href="/interview-questions"
                className="inline-flex items-center gap-2 rounded-[8px] text-[12px] text-[#606060] transition-colors hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
              >
                <ArrowLeft
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                Interview questions
              </Link>
              <h1 className="mt-8 max-w-[760px] break-words text-balance text-[clamp(2.55rem,13vw,5.3rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:leading-[0.94] sm:tracking-[-0.063em]">
                React interview questions
              </h1>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                Learn with visible answers or test yourself before revealing
                each explanation.
              </p>
            </div>

            <InterviewHeroAnimation variant="react" />
          </div>
        </section>

        <section className="px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto min-w-0 max-w-[1240px]">
            <QuestionPractice questions={reactInterviewQuestions} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
