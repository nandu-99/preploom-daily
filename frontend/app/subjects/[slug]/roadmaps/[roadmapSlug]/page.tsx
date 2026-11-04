import { SubjectsShell } from "@/components/subjects/subjects-shell";
import { getRoadmap, getSubject } from "@/lib/subjects";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type RoadmapPageProps = {
  params: Promise<{ slug: string; roadmapSlug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: RoadmapPageProps): Promise<Metadata> {
  const { slug, roadmapSlug } = await params;
  const { roadmap, unavailable } = await getRoadmap(slug, roadmapSlug);

  if (!roadmap && !unavailable) notFound();

  return roadmap
    ? {
        title: `${roadmap.title} | PrepLoom`,
        description:
          roadmap.summary ?? `Follow the ${roadmap.title} roadmap on PrepLoom.`,
      }
    : { title: "Roadmap | PrepLoom" };
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { slug, roadmapSlug } = await params;
  const [
    { subject, unavailable: subjectUnavailable },
    { roadmap, unavailable },
  ] = await Promise.all([getSubject(slug), getRoadmap(slug, roadmapSlug)]);

  if ((!subject && !subjectUnavailable) || (!roadmap && !unavailable)) {
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

          {roadmap ? (
            <>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                {subject?.name ?? "Learning roadmap"}
              </div>
              <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                {roadmap.title}
              </h1>
              {roadmap.summary ? (
                <p className="mt-7 max-w-[680px] text-pretty text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[18px]">
                  {roadmap.summary}
                </p>
              ) : null}
            </>
          ) : (
            <div role="alert" className="mt-12">
              <h1 className="max-w-[850px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                This roadmap is unavailable right now.
              </h1>
              <p className="mt-7 max-w-[54ch] text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3]">
                Please try again when the backend is running.
              </p>
            </div>
          )}
        </div>
      </section>

      {roadmap ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[760px]">
              <div className="flex items-end justify-between gap-4 border-b border-black/[0.12] pb-5 dark:border-white/[0.13]">
                <h2 className="text-[20px] font-medium tracking-[-0.03em]">
                  Your path
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                  {roadmap.steps.length}{" "}
                  {roadmap.steps.length === 1 ? "step" : "steps"}
                </span>
              </div>
              {roadmap.steps.length === 0 ? (
                <p className="py-8 text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                  Steps have not been added to this roadmap yet.
                </p>
              ) : (
                <ol>
                  {roadmap.steps.map((step, index) => (
                    <li
                      key={index}
                      className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-black/[0.09] py-8 dark:border-white/[0.1] sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-6"
                    >
                      <span className="pt-1 font-[family-name:var(--font-geist-mono)] text-[12px] text-[#777] dark:text-[#858585]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[20px] font-medium tracking-[-0.03em] sm:text-[22px]">
                          {step.title}
                        </h3>
                        <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[15px] sm:leading-8">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </SubjectsShell>
  );
}
