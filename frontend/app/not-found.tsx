import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-[#151515] selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-[#f3f3f1] dark:selection:text-[#151515]">
      <a
        href="#not-found-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main
        id="not-found-main"
        className="border-b border-black/[0.08] px-5 dark:border-white/[0.09] sm:px-6 lg:px-8"
      >
        <section className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-[1240px] items-center py-14 md:py-20">
          <div className="grid w-full max-w-[900px] gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-12">
            <div className="font-[family-name:var(--font-geist-mono)] text-2xl font-medium tracking-[-0.04em] text-[#777] dark:text-[#8f8f8f] md:border-r md:border-black/[0.1] md:pt-1 md:dark:border-white/[0.11]">
              404
            </div>

            <div className="max-w-[660px]">
              <h1 className="text-balance text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                We could not find that page.
              </h1>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                The link may be outdated or the page may have moved. Choose
                where you want to continue.
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-[#151515] px-5 text-sm font-medium text-white transition-[background-color,transform] hover:bg-[#252525] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515] dark:hover:bg-white dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
                >
                  <ArrowLeft
                    className="size-4"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  Back home
                </Link>
                <Link
                  href="/subjects"
                  className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-black/[0.11] px-5 text-sm font-medium text-[#555] transition-[border-color,background-color,color,transform] hover:border-black/25 hover:bg-black/[0.035] hover:text-[#151515] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50"
                >
                  <BookOpen
                    className="size-4"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  Browse subjects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
