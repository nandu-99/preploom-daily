import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuizRunner } from "@/components/quizzes/quiz-runner";
import { getPublicQuiz } from "@/lib/public-quizzes";

type QuizPageProps = {
  params: Promise<{ quizSlug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { quizSlug } = await params;
  const quiz = await getPublicQuiz(quizSlug);

  if (!quiz) return {};

  return {
    title: `${quiz.title} | PrepLoom`,
    description: quiz.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizSlug } = await params;
  const quiz = await getPublicQuiz(quizSlug);

  if (!quiz) notFound();

  return (
    <div className="min-h-screen bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <SiteHeader />
      <QuizRunner quiz={quiz} />
      <SiteFooter />
    </div>
  );
}
