import { FeedbackForm } from "@/components/feedback/feedback-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback | PrepLoom",
  description:
    "Share feedback about PrepLoom content, features, missing topics, or the website experience.",
};

const usefulFeedback = [
  "Mention the exact page or topic",
  "Explain what felt wrong or unclear",
  "Share what would make it more useful",
];

export default function FeedbackPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#feedback-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="feedback-main">
        <section className="px-5 py-9 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1040px]">
            <div className="max-w-2xl border-b border-black/[0.1] pb-6 dark:border-white/[0.11]">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#606060] dark:text-[#a8a8a8]">
                Feedback
              </p>
              <h1 className="mt-2 text-balance text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                Help us make PrepLoom better.
              </h1>
              <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#555] dark:text-[#b3b3b3]">
                Tell us what is useful, confusing, incorrect, or missing. Clear
                feedback helps us improve the right things.
              </p>
            </div>

            <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,680px)_minmax(220px,1fr)] lg:gap-16">
              <div>
                <h2 className="text-[17px] font-semibold tracking-[-0.025em]">
                  Share feedback
                </h2>
                <div className="mt-5">
                  <FeedbackForm />
                </div>
              </div>

              <aside className="border-t border-black/[0.11] pt-6 dark:border-white/[0.12] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <h2 className="text-[13px] font-medium">
                  Useful feedback includes
                </h2>
                <ol className="mt-4 space-y-4">
                  {usefulFeedback.map((detail, index) => (
                    <li
                      key={detail}
                      className="flex gap-4 text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8]"
                    >
                      <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#888] dark:text-[#777]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {detail}
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
