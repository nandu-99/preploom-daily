import { DsaPatternIllustration } from "@/components/dsa/dsa-pattern-illustration";
import { DsaSheetExplorer } from "@/components/dsa/dsa-sheet-explorer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";
import Link from "next/link";
import { getDsaSheets } from "@/lib/dsa-sheets";

export const metadata: Metadata = {
  title: "DSA Sheets | PrepLoom",
  description:
    "Choose a trusted DSA sheet for learning, interview preparation, or revision.",
};

const practiceFlow = [
  {
    title: "Learn the pattern",
    body: "Understand why the approach works before memorizing code.",
  },
  {
    title: "Try it alone",
    body: "Attempt the problem before opening hints or an editorial.",
  },
  {
    title: "Review mistakes",
    body: "Write down what blocked you and what finally worked.",
  },
  {
    title: "Revisit",
    body: "Solve difficult problems again after a short gap.",
  },
  {
    title: "Time yourself",
    body: "Use mixed, timed practice when the interview gets closer.",
  },
];

export const dynamic = "force-dynamic";

export default async function DsaPage() {
  const sheets = await getDsaSheets();
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#hybrid-dsa-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="hybrid-dsa-main">
        <section className="relative overflow-hidden border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(0,0,0,0.04),transparent_34%)] dark:bg-[radial-gradient(circle_at_78%_32%,rgba(255,255,255,0.035),transparent_34%)]"
          />
          <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end lg:gap-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                DSA preparation
              </div>
              <h1 className="mt-6 text-balance text-[clamp(3rem,6.2vw,6.2rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Choose one sheet.
                <span className="block text-[#777] dark:text-[#858585]">
                  Follow it properly.
                </span>
              </h1>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                Compare trusted DSA sheets based on your level, goal, and
                preparation style.
              </p>
              <a
                href="#dsa-sheets"
                className="mt-7 inline-flex h-11 items-center rounded-[10px] border border-black/15 bg-[#e5e5e2] px-4 text-[13px] font-medium transition-[background-color,border-color,transform] hover:border-black/25 hover:bg-[#ddddda] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border-white/[0.14] dark:bg-[#242424] dark:hover:border-white/25 dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
              >
                Choose a sheet
              </a>
              <Link
                href="/dsa/visualizations"
                className="mt-4 flex w-fit items-center gap-2 rounded-md py-2 text-sm font-medium text-neutral-800 underline underline-offset-4 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                Explore algorithm visualizations →
              </Link>
            </div>

            <DsaPatternIllustration />
          </div>
        </section>

        <section
          id="dsa-sheets"
          className="border-b border-black/[0.08] px-5 py-10 dark:border-white/[0.09] sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        >
          <div className="mx-auto grid max-w-[1240px] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
            <DsaSheetExplorer sheets={sheets} />

            <aside className="rounded-[14px] border border-black/[0.1] bg-white/55 p-5 shadow-[0_1px_2px_rgba(20,20,20,0.025)] dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none lg:sticky lg:top-[140px]">
              <h2 className="text-[24px] font-semibold leading-7 tracking-[-0.04em]">
                Use the sheet properly.
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-[#555] dark:text-[#b3b3b3]">
                Finishing a list matters less than understanding why each
                solution works.
              </p>

              <div className="mt-6 rounded-[12px] border border-black/[0.09] bg-black/[0.025] p-4 dark:border-white/[0.1] dark:bg-white/[0.04]">
                <h3 className="text-[14px] font-semibold">
                  The 30-minute DSA rule
                </h3>
                <p className="mt-2 text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                  Work on the problem alone for 30 focused minutes. If you are
                  still stuck, study one hint or explanation, close it, and
                  write the solution yourself. Mark the problem and retry it
                  within 48 hours.
                </p>
              </div>

              <ol className="mt-7 grid gap-5">
                {practiceFlow.map((item, index) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[24px_minmax(0,1fr)] gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="pt-0.5 text-[10px] tabular-nums text-[#777] dark:text-[#858585]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
