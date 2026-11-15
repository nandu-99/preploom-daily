import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RoadmapExplorer } from "@/components/roadmaps/roadmap-explorer";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Route } from "lucide-react";
import Link from "next/link";
import { getPublicRoadmaps } from "@/lib/public-roadmaps";

export const metadata: Metadata = {
  title: "Roadmaps | PrepLoom",
  description:
    "Choose a clear technical interview roadmap and learn each subject in the right order.",
};

const paths = ["Frontend", "Backend", "DSA Practice"];

export const dynamic = "force-dynamic";

export default async function RoadmapsPage() {
  const roadmaps = await getPublicRoadmaps();
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#hybrid-roadmaps-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="hybrid-roadmaps-main">
        <section className="relative overflow-hidden border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(0,0,0,0.04),transparent_34%)] dark:bg-[radial-gradient(circle_at_78%_32%,rgba(255,255,255,0.035),transparent_34%)]"
          />
          <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                Interview roadmaps
              </div>
              <h1 className="mt-6 text-balance text-[clamp(3rem,6.2vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Know what to
                <span className="block text-[#777] dark:text-[#858585]">
                  study next.
                </span>
              </h1>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                Choose your goal. See what to learn first, what comes next, and
                what to revise.
              </p>
              <a
                href="#roadmap-explorer"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[transform,background-color] hover:bg-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
              >
                Choose a roadmap
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="border-y border-black/[0.1] py-2 dark:border-white/[0.11]">
              {paths.map((path, index) => (
                <div
                  key={path}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-black/[0.08] py-3.5 last:border-b-0 dark:border-white/[0.09]"
                >
                  <span className="text-[10px] text-[#777] dark:text-[#858585]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-medium">{path}</span>
                  <Route
                    className="size-4 text-[#777] dark:text-[#858585]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="roadmap-explorer"
          className="border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-[1240px]">
            <RoadmapExplorer roadmaps={roadmaps} />
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[1240px] gap-8 rounded-[20px] border border-black/[0.1] bg-[#ededeb] p-6 dark:border-white/[0.11] dark:bg-[#121212] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
            <div className="max-w-3xl">
              <BookOpen
                className="size-6 text-[#606060] dark:text-[#a8a8a8]"
                strokeWidth={1.55}
                aria-hidden="true"
              />
              <h2 className="mt-6 text-balance text-[clamp(2.3rem,4.2vw,4.2rem)] font-semibold leading-[0.96] tracking-[-0.057em]">
                Not sure where to begin?
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[15px]">
                Start with Operating Systems to build a strong foundation for
                technical interviews.
              </p>
            </div>
            <Link
              href="/subjects/operating-systems"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#151515] px-5 text-[14px] font-medium text-white transition-[transform,background-color] hover:bg-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ededeb] dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#121212]"
            >
              Start with Operating Systems
              <ArrowRight
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
