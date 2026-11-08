import { QuizPlayer } from "@/components/subjects/quiz-player";
import { SubjectsShell } from "@/components/subjects/subjects-shell";
import { getQuiz, getSubject } from "@/lib/subjects";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type QuizPageProps = {
  params: Promise<{ slug: string; quizSlug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { slug, quizSlug } = await params;
  const { quiz, unavailable } = await getQuiz(slug, quizSlug);
  if (!quiz && !unavailable) notFound();

  return quiz
    ? {
        title: `${quiz.title} | PrepLoom`,
        description: quiz.summary ?? `Practice ${quiz.title} on PrepLoom.`,
      }
    : { title: "Quiz | PrepLoom" };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug, quizSlug } = await params;
  const [{ subject, unavailable: subjectUnavailable }, { quiz, unavailable }] =
    await Promise.all([getSubject(slug), getQuiz(slug, quizSlug)]);
  if ((!subject && !subjectUnavailable) || (!quiz && !unavailable)) notFound();

  return (
    <SubjectsShell>
      <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Link
            href={subject ? `/subjects/${subject.slug}` : "/subjects"}
            className="inline-flex items-center gap-2 rounded-[8px] text-[13px] font-medium text-[#606060] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:text-white"
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            {subject ? `Back to ${subject.name}` : "All subjects"}
          </Link>

          {quiz ? (
            <>
              <div className="mt-12 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                {subject?.name ?? "Quiz"}
              </div>
              <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                {quiz.title}
              </h1>
              {quiz.summary ? (
                <p className="mt-7 max-w-[680px] text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3]">
                  {quiz.summary}
                </p>
              ) : null}
            </>
          ) : (
            <div role="alert" className="mt-12">
              <h1 className="text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                This quiz is unavailable right now.
              </h1>
              <p className="mt-7 text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3]">
                Please try again when the backend is running.
              </p>
            </div>
          )}
        </div>
      </section>

      {quiz ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <QuizPlayer quiz={quiz} subjectSlug={slug} />
          </div>
        </section>
      ) : null}
    </SubjectsShell>
  );
}
