import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | PrepLoom",
  description:
    "Learn why PrepLoom brings technical interview notes, roadmaps, quizzes, and trusted resources into one focused place.",
};

const preparationSteps = [
  {
    number: "01",
    title: "Learn the core subjects",
    body: "Use structured notes to understand the computer science ideas that interviews return to often.",
  },
  {
    number: "02",
    title: "Follow a clear direction",
    body: "Use curated roadmaps when you know your goal but are not sure what to prepare next.",
  },
  {
    number: "03",
    title: "Check what you remember",
    body: "Take focused quizzes after studying and review every answer together when you finish.",
  },
  {
    number: "04",
    title: "Use trusted resources",
    body: "Find selected DSA sheets, developer tools, project ideas, and practical setup guides.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#about-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="about-main">
        <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
              <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
              About PrepLoom
            </div>
            <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              Interview preparation should feel clear.
            </h1>
            <p className="mt-7 max-w-[680px] text-pretty text-[16px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[18px]">
              PrepLoom brings core CS notes, roadmaps, quizzes, and trusted
              resources into one focused place.
            </p>
          </div>
        </section>

        <section className="border-b border-black/[0.08] px-5 py-16 dark:border-white/[0.09] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div className="max-w-md">
              <h2 className="text-balance text-[clamp(2rem,3.4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.052em]">
                Built to remove the guesswork.
              </h2>
              <p className="mt-5 text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                Preparation is already difficult. Finding the right notes,
                deciding what to study, and checking your progress should not
                make it harder.
              </p>
            </div>

            <ol className="border-t border-black/[0.12] dark:border-white/[0.13]">
              {preparationSteps.map((step) => (
                <li
                  key={step.number}
                  className="grid gap-3 border-b border-black/[0.1] py-6 dark:border-white/[0.11] sm:grid-cols-[48px_0.75fr_1.25fr] sm:items-start sm:gap-6"
                >
                  <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                    {step.number}
                  </span>
                  <h3 className="text-[15px] font-medium tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="max-w-[52ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-24">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[clamp(2rem,3.4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.052em]">
                Useful preparation, without pretending to be everything.
              </h2>
              <p className="mt-5 max-w-[62ch] text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                PrepLoom creates structured learning and quiz experiences. When
                a trusted platform already does something well, we point you to
                the original source instead of copying it.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[420px]:flex-row lg:justify-end">
              <Link
                href="/subjects"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:-translate-y-px hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
              >
                Explore subjects
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/roadmaps"
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-black/[0.12] px-4 text-[13px] font-medium transition-colors hover:border-black/25 hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.13] dark:hover:border-white/25 dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50"
              >
                Browse roadmaps
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
