import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | PrepLoom",
  description:
    "Contact PrepLoom with a content correction, resource suggestion, product feedback, or general question.",
};

const helpfulDetails = [
  "The link to the page you are referring to",
  "What you expected and what happened",
  "The corrected source when reporting content",
];

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#contact-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="contact-main">
        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1040px]">
            <div className="max-w-2xl border-b border-black/[0.1] pb-8 dark:border-white/[0.11]">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#606060] dark:text-[#a8a8a8]">
                Contact
              </p>
              <h1 className="mt-3 text-balance text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.052em]">
                Tell us what needs attention.
              </h1>
              <p className="mt-4 max-w-[600px] text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                Send a correction, suggest a useful resource, share feedback, or
                ask a general question.
              </p>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,680px)_minmax(220px,1fr)] lg:gap-16">
              <div>
                <h2 className="text-[17px] font-semibold tracking-[-0.025em]">
                  Send a message
                </h2>
                <div className="mt-5">
                  <ContactForm />
                </div>
              </div>

              <aside className="border-t border-black/[0.11] pt-6 dark:border-white/[0.12] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <h2 className="text-[13px] font-medium">
                  What helps us act faster
                </h2>
                <ol className="mt-4 space-y-4">
                  {helpfulDetails.map((detail, index) => (
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
