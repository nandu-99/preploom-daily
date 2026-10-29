import { SubjectsShell } from "@/components/subjects/subjects-shell";
import { getSubject, getTopics } from "@/lib/subjects";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type SubjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { subject, unavailable } = await getSubject(slug);

  if (!subject && !unavailable) notFound();

  return subject
    ? {
        title: `${subject.name} | PrepLoom`,
        description:
          subject.description ?? `Explore ${subject.name} on PrepLoom.`,
      }
    : { title: "Subject | PrepLoom" };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const [{ subject, unavailable }, topics] = await Promise.all([
    getSubject(slug),
    getTopics(slug),
  ]);

  if (!subject && !unavailable) notFound();

  return (
    <SubjectsShell>
      <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 rounded-[8px] text-[13px] font-medium text-[#606060] transition-colors hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            All subjects
          </Link>

          {unavailable ? (
            <div role="alert" className="mt-12">
              <h1 className="max-w-[850px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                This subject is unavailable right now.
              </h1>
              <p className="mt-7 max-w-[54ch] text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3]">
                Please try again when the backend is running.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                Subject
              </div>
              <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                {subject?.name}
              </h1>
              {subject?.description ? (
                <p className="mt-7 max-w-[680px] text-pretty text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[18px]">
                  {subject.description}
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>

      {subject ? (
        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div className="max-w-md">
              <h2 className="text-balance text-[clamp(2rem,3.4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.052em]">
                Explore topics.
              </h2>
              <p className="mt-5 text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                Choose a topic to read notes prepared for this subject.
              </p>
            </div>
            <div>
              <div className="flex items-end justify-between gap-4 border-b border-black/[0.12] pb-5 dark:border-white/[0.13]">
                <h3 className="text-[20px] font-medium tracking-[-0.03em]">
                  Topics
                </h3>
                {topics ? (
                  <span className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                    {topics.length} {topics.length === 1 ? "topic" : "topics"}
                  </span>
                ) : null}
              </div>
              {topics === null ? (
                <p
                  role="alert"
                  className="py-8 text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]"
                >
                  Topics are unavailable right now. Please try again when the
                  backend is running.
                </p>
              ) : topics.length === 0 ? (
                <div className="py-8">
                  <BookOpen
                    className="size-7 text-[#777] dark:text-[#8f8f8f]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <p className="mt-5 text-[20px] font-medium tracking-[-0.025em]">
                    No topics yet.
                  </p>
                  <p className="mt-3 text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                    Topics will appear here after they are added through the
                    admin portal.
                  </p>
                </div>
              ) : (
                <div>
                  {topics.map((topic, index) => (
                    <Link
                      key={topic.id}
                      href={`/subjects/${subject.slug}/topics/${topic.slug}`}
                      className="group grid grid-cols-[36px_minmax(0,1fr)_20px] gap-4 border-b border-black/[0.09] py-7 transition-colors hover:text-[#444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.1] dark:hover:text-white dark:focus-visible:ring-white/50 sm:grid-cols-[48px_minmax(0,1fr)_20px]"
                    >
                      <span className="pt-1 font-[family-name:var(--font-geist-mono)] text-[12px] text-[#777] dark:text-[#858585]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[20px] font-medium tracking-[-0.03em] sm:text-[22px]">
                          {topic.title}
                        </span>
                        {topic.summary ? (
                          <span className="mt-2 block max-w-[48ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                            {topic.summary}
                          </span>
                        ) : null}
                      </span>
                      <ArrowRight
                        className="mt-1 size-4 text-[#777] transition-transform group-hover:translate-x-1 dark:text-[#999]"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </SubjectsShell>
  );
}
