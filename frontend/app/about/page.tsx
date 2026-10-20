import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why PrepLoom brings technical interview notes, roadmaps, quizzes, and trusted resources into one focused place.",
};

const preparationSteps = [
  {
    title: "Learn the core subjects",
    body: "Use structured notes to understand the computer science ideas that interviews return to often.",
  },
  {
    title: "Follow a clear direction",
    body: "Use curated roadmaps when you know your goal but are not sure what to prepare next.",
  },
  {
    title: "Check what you remember",
    body: "Take focused quizzes after studying and review every answer when you finish.",
  },
  {
    title: "Use trusted resources",
    body: "Find selected DSA sheets, developer tools, project ideas, and practical setup guides.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <SiteHeader />
      <main id="main-content">
        <section className="border-b border-[var(--border)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              About PrepLoom
            </p>
            <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.75rem,7vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              Interview preparation should feel clear.
            </h1>
            <p className="mt-7 max-w-[680px] text-pretty text-base leading-8 text-[var(--muted)] sm:text-lg">
              PrepLoom brings core computer science notes, roadmaps, quizzes,
              and trusted resources into one focused place.
            </p>
          </div>
        </section>

        <section className="border-b border-[var(--border)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div className="max-w-md">
              <h2 className="text-balance text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.052em]">
                Built to remove the guesswork.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                Preparation is already difficult. Finding the right notes,
                deciding what to study, and checking progress should not make it
                harder.
              </p>
            </div>

            <ol className="grid gap-x-8 border-t border-[var(--border-strong)] sm:grid-cols-2">
              {preparationSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="border-b border-[var(--border)] py-6"
                >
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[var(--subtle)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-base font-medium tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-sm leading-6 text-[var(--muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 lg:p-14">
            <h2 className="max-w-[760px] text-balance text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.052em]">
              Useful preparation, without pretending to be everything.
            </h2>
            <p className="mt-6 max-w-[66ch] text-sm leading-7 text-[var(--muted)]">
              PrepLoom creates structured learning and practice experiences.
              When another trusted platform already does something well, we
              guide you to the original source.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--background)] transition-[opacity,transform] hover:opacity-85 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              Return home
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
