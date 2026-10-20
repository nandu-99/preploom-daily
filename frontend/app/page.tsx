import { HeroSearchTrigger } from "@/components/hero-search-trigger";
import { ProductMap } from "@/components/home/product-map";
import { TopicFocusIllustration } from "@/components/home/topic-focus-illustration";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GridPattern } from "@/components/ui/grid-pattern";
import { ArrowRight, Check, Command } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PrepLoom",
  description:
    "Master core concepts with structured notes, curated roadmaps, quizzes, interview questions, and trusted resources.",
};

const popularTopics = [
  [
    "Deadlocks",
    "/subjects/operating-systems?topic=deadlock-fundamentals#reading-preview-note",
  ],
  ["Polymorphism", "/subjects/oop?topic=polymorphism#reading-preview-note"],
  [
    "Normalization",
    "/subjects/dbms?topic=normalization-and-anomalies#reading-preview-note",
  ],
  [
    "TCP/IP Models",
    "/subjects/computer-networks?topic=osi-and-tcp-ip-models#reading-preview-note",
  ],
];

const subjects = [
  ["Operating Systems", "Processes, memory, scheduling"],
  ["Database Systems", "Transactions, SQL, indexing"],
  ["Computer Networks", "Protocols, layers, the web"],
  ["Object-Oriented Design", "Principles, patterns, trade-offs"],
];

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#homepage-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="homepage-main">
        <section className="relative isolate flex items-start overflow-hidden border-b border-black/[0.08] px-5 py-9 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:min-h-[calc(100dvh-68px)] lg:items-center lg:px-8 lg:py-16">
          <GridPattern
            width={58}
            height={58}
            className="fill-transparent stroke-black/[0.04] [mask-image:radial-gradient(ellipse_75%_72%_at_50%_42%,black_18%,transparent_78%)] dark:stroke-white/[0.045]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_38%,rgba(255,255,255,0.78),rgba(255,255,255,0)_54%)] dark:bg-[radial-gradient(circle_at_28%_38%,rgba(255,255,255,0.025),rgba(0,0,0,0)_54%)]"
          />
          <div className="relative mx-auto grid w-full min-w-0 max-w-[1240px] items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] lg:gap-16 xl:gap-24">
            <div className="min-w-0 max-w-[700px]">
              <div className="flex items-center text-[10px] font-medium uppercase tracking-[0.15em] text-[#606060] dark:text-[#a8a8a8] sm:gap-3 sm:text-[11px] sm:tracking-[0.18em]">
                <span className="hidden h-px w-7 bg-black/25 dark:bg-white/25 sm:block" />
                <span className="sm:hidden">Technical interview prep</span>
                <span className="hidden sm:inline">
                  Built for technical interviews
                </span>
              </div>
              <h1 className="mt-5 max-w-[700px] text-balance text-[clamp(2.3rem,10.8vw,4.55rem)] font-semibold leading-[1.01] tracking-[-0.05em] sm:mt-7 sm:text-[clamp(2.75rem,5vw,4.55rem)] sm:leading-[0.99] sm:tracking-[-0.055em]">
                <span className="sm:hidden">
                  Prepare smarter for technical interviews.
                </span>
                <span className="hidden sm:inline">
                  Prepare smarter for your next technical interview.
                </span>
              </h1>
              <p className="mt-4 max-w-[620px] text-pretty text-[15px] leading-6 text-[#555] dark:text-[#b3b3b3] sm:mt-6 sm:text-[17px] sm:leading-8">
                <span className="sm:hidden">
                  Study core concepts with notes, roadmaps, quizzes, interview
                  questions, and trusted resources.
                </span>
                <span className="hidden sm:inline">
                  Master core concepts with structured notes, curated roadmaps,
                  quizzes, interview questions, and trusted resources, all in
                  one place.
                </span>
              </p>
              <div className="mt-6 max-w-[650px] sm:mt-8">
                <HeroSearchTrigger />
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-center gap-2.5 sm:mt-4 sm:flex">
                <Link
                  href="/subjects"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#151515] px-3 text-[13px] font-medium text-white transition-transform hover:-translate-y-px dark:border dark:border-white/[0.14] dark:bg-[#242424] sm:px-4 sm:text-sm"
                >
                  Explore subjects{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/roadmaps"
                  className="inline-flex h-10 items-center justify-center rounded-[10px] px-2 text-[13px] font-medium text-[#606060] hover:bg-black/[0.04] dark:text-[#a8a8a8] dark:hover:bg-white/[0.06] sm:px-4 sm:text-sm"
                >
                  <span className="sm:hidden">Roadmaps</span>
                  <span className="hidden sm:inline">Explore roadmaps</span>
                </Link>
              </div>
              <div className="-mx-5 mt-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-7 sm:overflow-visible sm:px-0 sm:pb-0">
                <div className="flex w-max items-center gap-2 text-xs text-[#606060] sm:w-auto sm:flex-wrap sm:text-[13px]">
                  <span className="mr-1 shrink-0 font-medium text-[#151515] dark:text-[#f3f3f1]">
                    Popular
                  </span>
                  {popularTopics.map(([label, href], index) => (
                    <Link
                      key={label}
                      href={href}
                      className={`${index === 3 ? "hidden sm:inline-flex" : "shrink-0"} rounded-full border border-black/[0.11] bg-black/[0.02] px-3 py-1.5 hover:border-black/25 dark:border-white/[0.12] dark:bg-white/[0.035]`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <figure
              className="relative mx-auto hidden w-full max-w-[640px] origin-center scale-[1.16] items-center justify-center lg:flex xl:scale-[1.25]"
              aria-label="PrepLoom preparation loop"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-16 bottom-8 top-20 rounded-full bg-black/[0.06] blur-3xl dark:bg-white/[0.035]"
              />
              <Image
                src="https://preploom.vercel.app/hero1-Photoroom.png"
                width={1295}
                height={1215}
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 48vw, 0px"
                priority
                alt="A study note showing the PrepLoom loop: learn, revise, recall, explain, test, and improve."
                className="relative h-auto w-full object-contain"
              />
            </figure>
          </div>
        </section>

        <section className="border-b border-black/[0.08] px-5 py-24 dark:border-white/[0.09] sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div className="max-w-lg">
              <h2 className="text-balance text-[clamp(2.5rem,4.5vw,4.6rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
                Learn the subjects asked in technical interviews.
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                Start with computer science basics. Then move to system design
                and other topics when you are ready.
              </p>
              <Link
                href="/subjects"
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium underline decoration-black/25 underline-offset-4 dark:decoration-white/30"
              >
                Browse the curriculum{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-t border-black/[0.12] dark:border-white/[0.13]">
              {subjects.map(([title, description], index) => (
                <div
                  key={title}
                  className="grid grid-cols-[38px_1fr_auto] items-center gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[54px_1fr_auto] sm:py-7"
                >
                  <span className="text-[12px] text-[#777] dark:text-[#858585]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[18px] font-medium tracking-[-0.025em] sm:text-[21px]">
                      {title}
                    </h3>
                    <p className="mt-1 text-[12px] text-[#606060] dark:text-[#a8a8a8] sm:text-[13px]">
                      {description}
                    </p>
                  </div>
                  <Check className="size-4 text-[#777]" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
                Choose what you need today.
              </h2>
              <p className="mt-2.5 max-w-[54ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8] sm:text-[14px]">
                Start with subjects, use a roadmap for direction, or open one
                focused resource.
              </p>
            </div>
            <div className="mt-6">
              <ProductMap />
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-[1240px]">
            <div className="relative grid overflow-hidden rounded-[20px] border border-black/[0.1] bg-[#ededeb] px-6 py-16 dark:border-white/[0.11] dark:bg-[#121212] sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)] lg:items-center lg:gap-16 lg:px-16 lg:py-24">
              <div className="relative max-w-3xl">
                <Command
                  className="size-6 text-[#606060] dark:text-[#a8a8a8]"
                  aria-hidden="true"
                />
                <h2 className="mt-7 text-balance text-[clamp(2.6rem,5vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.067em]">
                  Start with one topic today.
                </h2>
                <p className="mt-6 max-w-[50ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                  Learn the full idea first. Then use the shorter notes when
                  your interview is close.
                </p>
                <Link
                  href="/subjects/operating-systems"
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#151515] px-5 text-[14px] font-medium text-white dark:border dark:border-white/[0.14] dark:bg-[#242424]"
                >
                  Open Operating Systems{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-14 border-t border-black/[0.1] pt-10 dark:border-white/[0.11] lg:mt-0 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                <TopicFocusIllustration />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
