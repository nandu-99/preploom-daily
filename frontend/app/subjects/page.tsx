import { SubjectsShell } from "@/components/subjects/subjects-shell";
import { getSubjects } from "@/lib/subjects";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subjects | PrepLoom",
  description:
    "Browse technical interview subjects and choose what to study next.",
};

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <SubjectsShell>
      <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
            <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
            Technical interview preparation
          </div>
          <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
            Learn one subject at a time.
          </h1>
          <p className="mt-7 max-w-[680px] text-pretty text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[18px]">
            Choose a core topic and build a clearer path through technical
            interview preparation.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-end justify-between gap-4 border-b border-black/[0.12] pb-5 dark:border-white/[0.13]">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Browse subjects
            </h2>
            {subjects ? (
              <span className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                {subjects.length}{" "}
                {subjects.length === 1 ? "subject" : "subjects"}
              </span>
            ) : null}
          </div>

          {subjects === null ? (
            <div role="alert" className="py-16">
              <h3 className="text-[20px] font-medium tracking-[-0.025em]">
                Subjects are unavailable right now.
              </h3>
              <p className="mt-3 max-w-[48ch] text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                Please try again when the backend is running.
              </p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="py-16">
              <BookOpen
                className="size-7 text-[#777] dark:text-[#8f8f8f]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-5 text-[20px] font-medium tracking-[-0.025em]">
                No subjects yet.
              </h3>
              <p className="mt-3 max-w-[48ch] text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                New subjects will appear here after they are added through the
                admin portal.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 md:gap-x-12">
              {subjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.slug}`}
                  className="group grid grid-cols-[36px_minmax(0,1fr)_20px] gap-4 border-b border-black/[0.09] py-7 transition-colors hover:text-[#444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.1] dark:hover:text-white dark:focus-visible:ring-white/50 sm:grid-cols-[48px_minmax(0,1fr)_20px]"
                >
                  <span className="pt-1 font-[family-name:var(--font-geist-mono)] text-[12px] text-[#777] dark:text-[#858585]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[20px] font-medium tracking-[-0.03em] sm:text-[22px]">
                      {subject.name}
                    </span>
                    {subject.description ? (
                      <span className="mt-2 block max-w-[48ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                        {subject.description}
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
      </section>
    </SubjectsShell>
  );
}
