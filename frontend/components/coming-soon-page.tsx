import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";

export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#coming-soon-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main
        id="coming-soon-main"
        className="flex min-h-[calc(100dvh-68px)] items-center border-b border-black/[0.08] px-5 py-20 dark:border-white/[0.09] sm:px-6 lg:px-8"
      >
        <section className="mx-auto w-full max-w-[900px] text-center">
          <Clock3
            className="mx-auto size-7 text-[#777] dark:text-[#999]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-6 text-[12px] font-medium text-[#606060] dark:text-[#a8a8a8]">
            Coming soon
          </p>
          <h1 className="mx-auto mt-5 max-w-[760px] text-balance text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
            {title}
          </h1>
          <p className="mx-auto mt-7 max-w-[56ch] text-pretty text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
            {description}
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 min-[420px]:flex-row min-[420px]:items-center">
            <Link
              href="/subjects/operating-systems"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#151515] px-5 text-sm font-medium text-white transition-[background-color,transform] hover:bg-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
            >
              Study Operating Systems
              <ArrowRight
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/subjects"
              className="inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-medium text-[#606060] transition-colors hover:bg-black/[0.04] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50"
            >
              View all subjects
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
