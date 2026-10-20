import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <SiteHeader />
      <main
        id="main-content"
        className="flex min-h-[calc(100dvh-68px)] items-center border-b border-[var(--border)] px-5 py-16 sm:px-6 lg:px-8"
      >
        <section className="mx-auto grid w-full max-w-[1000px] gap-8 md:grid-cols-[140px_minmax(0,1fr)] md:gap-14">
          <p className="font-[family-name:var(--font-geist-mono)] text-2xl font-medium tracking-[-0.04em] text-[var(--subtle)] md:border-r md:border-[var(--border)] md:py-2">
            404
          </p>
          <div className="max-w-[680px]">
            <h1 className="text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
              We could not find that page.
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              The link may be outdated or the page may have moved. Choose where
              you want to continue.
            </p>
            <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--background)] transition-[opacity,transform] hover:opacity-85 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Back home
              </Link>
              <Link
                href="/about"
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[10px] border border-[var(--border-strong)] px-5 text-sm font-medium transition-[background-color,transform] hover:bg-[var(--surface)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
              >
                About PrepLoom
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
