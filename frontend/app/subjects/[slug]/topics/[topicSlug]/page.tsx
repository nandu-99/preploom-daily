import { SubjectsShell } from "@/components/subjects/subjects-shell";
import { getSubject, getTopic } from "@/lib/subjects";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type TopicPageProps = {
  params: Promise<{ slug: string; topicSlug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug, topicSlug } = await params;
  const { topic, unavailable } = await getTopic(slug, topicSlug);

  if (!topic && !unavailable) notFound();

  return topic
    ? {
        title: `${topic.title} | PrepLoom`,
        description: topic.summary ?? `Read ${topic.title} on PrepLoom.`,
      }
    : { title: "Topic | PrepLoom" };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug, topicSlug } = await params;
  const [{ subject, unavailable: subjectUnavailable }, { topic, unavailable }] =
    await Promise.all([getSubject(slug), getTopic(slug, topicSlug)]);

  if ((!subject && !subjectUnavailable) || (!topic && !unavailable)) {
    notFound();
  }

  return (
    <SubjectsShell>
      <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Link
            href={subject ? `/subjects/${subject.slug}` : "/subjects"}
            className="inline-flex items-center gap-2 rounded-[8px] text-[13px] font-medium text-[#606060] transition-colors hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            {subject ? `Back to ${subject.name}` : "All subjects"}
          </Link>

          {topic ? (
            <>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                {subject?.name ?? "Study notes"}
              </div>
              <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                {topic.title}
              </h1>
              {topic.summary ? (
                <p className="mt-7 max-w-[680px] text-pretty text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[18px]">
                  {topic.summary}
                </p>
              ) : null}
            </>
          ) : (
            <div role="alert" className="mt-12">
              <h1 className="max-w-[850px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                This topic is unavailable right now.
              </h1>
              <p className="mt-7 max-w-[54ch] text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3]">
                Please try again when the backend is running.
              </p>
            </div>
          )}
        </div>
      </section>

      {topic ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[760px]">
              <h2 className="border-b border-black/[0.12] pb-5 text-[20px] font-medium tracking-[-0.03em] dark:border-white/[0.13]">
                Study notes
              </h2>
              <div className="mt-8 whitespace-pre-wrap break-words text-[15px] leading-8 text-[#3f3f3f] dark:text-[#c8c8c8] sm:text-[16px]">
                {topic.content}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </SubjectsShell>
  );
}
