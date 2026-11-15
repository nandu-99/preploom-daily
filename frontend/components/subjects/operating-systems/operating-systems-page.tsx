import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OperatingSystemsIllustration } from "@/components/subjects/operating-systems/operating-systems-illustration";
import { SubjectReader } from "@/components/subjects/subject-reader";
import type { SubjectContent } from "@/lib/subject-content";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Operating Systems | PrepLoom",
  description:
    "Learn Operating Systems with detailed notes, quick review, recall cues, and flexible reading layouts.",
};

export default function OperatingSystemsPage({ course }: { course: SubjectContent }) {
  const operatingSystemsContent = course;
  const topicCount = operatingSystemsContent.modules.reduce(
    (total, module) => total + module.topics.length,
    0,
  );

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#reading-preview-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="reading-preview-main">
        <section className="border-b border-black/[0.08] px-5 py-8 dark:border-white/[0.09] sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1240px]">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 text-[13px] text-[#606060] transition-colors hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
            >
              <ArrowLeft
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              All subjects
            </Link>

            <div className="mt-6 grid items-start gap-10 sm:mt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div className="max-w-2xl">
                <h1 className="text-balance text-[clamp(3.5rem,6.8vw,7rem)] font-semibold leading-[0.89] tracking-[-0.075em]">
                  Operating
                  <span className="block text-[#777] dark:text-[#858585]">
                    Systems.
                  </span>
                </h1>
                <p className="mt-7 max-w-[54ch] text-[16px] leading-8 text-[#505050] dark:text-[#b8b8b8] sm:text-[17px]">
                  Learn how a computer runs programs, shares memory, uses the
                  CPU, and handles many tasks at once.
                </p>

                <dl className="mt-9 grid max-w-sm grid-cols-2 border-y border-black/[0.1] py-5 dark:border-white/[0.11]">
                  <div>
                    <dt className="text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                      Modules
                    </dt>
                    <dd className="mt-1 text-[20px] font-medium">
                      {operatingSystemsContent.modules.length}
                    </dd>
                  </div>
                  <div className="border-l border-black/[0.1] pl-5 dark:border-white/[0.11]">
                    <dt className="text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                      Topics
                    </dt>
                    <dd className="mt-1 text-[20px] font-medium">
                      {topicCount}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="relative lg:-mr-4">
                <OperatingSystemsIllustration />
              </div>
            </div>
          </div>
        </section>

        <SubjectReader subject={operatingSystemsContent} />
      </main>

      <SiteFooter />
    </div>
  );
}
