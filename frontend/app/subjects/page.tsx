import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SubjectsPage } from "@/components/subjects/subjects-page";
import { getCatalogSubjects } from "@/lib/subject-catalog";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subjects | PrepLoom",
  description:
    "Choose a technical interview subject and prepare it with clear notes and focused revision.",
};

export const dynamic = "force-dynamic";

export default async function SubjectsRoute() {
  const subjects = await getCatalogSubjects();
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#hybrid-subjects-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="hybrid-subjects-main">
        {subjects.length ? (
          <SubjectsPage subjects={subjects} />
        ) : (
          <p className="mx-auto max-w-[1240px] px-5 py-20">
            Subjects are unavailable right now.
          </p>
        )}

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-10 rounded-[20px] border border-black/[0.1] bg-[#ededeb] p-6 dark:border-white/[0.11] dark:bg-[#121212] sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:p-14">
            <div>
              <h2 className="text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                Not sure where to start?
              </h2>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                Start with Operating Systems. It helps you understand how
                programs, memory, and the CPU work together.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                href="/subjects/operating-systems"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#151515] px-5 text-[14px] font-medium text-white transition-transform hover:bg-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ededeb] dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#121212]"
              >
                Open Operating Systems
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
