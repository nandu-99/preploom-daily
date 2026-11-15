import { getInterviewCounts } from "@/lib/interview-questions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { InterviewOverviewAnimation } from "@/components/interview-questions/interview-overview-animation";
import {
  ArrowRight,
  Boxes,
  Braces,
  Code2,
  Cpu,
  Database,
  FileCode2,
  MessageSquareText,
  Network,
  Server,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Interview Questions | PrepLoom",
  description:
    "Practice technical interview questions with focused practice and test modes.",
};

type Topic = {
  name: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  detail?: string;
};

const topics: Topic[] = [
  {
    name: "Behavioral",
    description:
      "Ownership, teamwork, leadership, setbacks, and answers grounded in real experience.",
    icon: MessageSquareText,
    href: "/interview-questions/behavioral",
    detail: "",
  },
  {
    name: "Operating Systems",
    description:
      "Processes, scheduling, synchronization, memory, file systems, and practical scenarios.",
    icon: Cpu,
    href: "/interview-questions/operating-systems",
    detail: "",
  },
  {
    name: "Computer Networks",
    description:
      "Web protocols, TCP/IP, routing, addressing, security, and troubleshooting.",
    icon: Network,
    href: "/interview-questions/computer-networks",
    detail: "",
  },
  {
    name: "OOP",
    description:
      "Objects, inheritance, polymorphism, SOLID principles, and practical design decisions.",
    icon: Boxes,
    href: "/interview-questions/oop",
    detail: "",
  },
  {
    name: "DBMS",
    description:
      "SQL, normalization, transactions, indexing, concurrency, and practical database decisions.",
    icon: Database,
    href: "/interview-questions/dbms",
    detail: "",
  },
  {
    name: "HTML",
    description:
      "Document structure, semantics, forms, accessibility, and browser behavior.",
    icon: Code2,
    href: "/interview-questions/html",
    detail: "",
  },
  {
    name: "CSS",
    description:
      "Layout, responsive design, selectors, the cascade, and rendering.",
    icon: Sparkles,
    href: "/interview-questions/css",
    detail: "",
  },
  {
    name: "JavaScript",
    description:
      "Language fundamentals, the runtime, asynchronous code, and the DOM.",
    icon: Braces,
    href: "/interview-questions/javascript",
    detail: "",
  },
  {
    name: "React",
    description:
      "Components, hooks, state, rendering, and application architecture.",
    icon: Code2,
    href: "/interview-questions/react",
    detail: "",
  },
  {
    name: "TypeScript",
    description:
      "Types, narrowing, generics, inference, and safer application code.",
    icon: FileCode2,
  },
  {
    name: "Node.js",
    description:
      "The event loop, APIs, modules, streams, and backend fundamentals.",
    icon: Server,
  },
];

export const dynamic = "force-dynamic";

export default async function InterviewQuestionsPage() {
  const counts = await getInterviewCounts();
  const liveTopics = topics.map((topic) => ({ ...topic, detail: topic.href && counts[topic.href.split("/").pop() ?? ""] !== undefined ? `${counts[topic.href.split("/").pop() ?? ""]} questions` : topic.detail }));
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-[#151515] selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-[#f3f3f1] dark:selection:text-[#151515]">
      <a
        href="#interview-questions-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="interview-questions-main">
        <section className="border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
            <div>
              <p className="text-[11px] font-medium text-[#606060] dark:text-[#a8a8a8]">
                Interview preparation
              </p>
              <h1 className="mt-5 max-w-[760px] text-balance text-[clamp(3rem,5.5vw,5.6rem)] font-semibold leading-[0.94] tracking-[-0.064em]">
                Prepare your answers before the interview.
              </h1>
              <p className="mt-6 max-w-[55ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                Choose a topic, explain each answer aloud, and check what you
                missed.
              </p>
            </div>

            <InterviewOverviewAnimation />
          </div>
        </section>

        <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-[clamp(1.8rem,3vw,2.7rem)] font-semibold tracking-[-0.045em]">
              Choose a topic
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {liveTopics.map((topic) => {
                const Icon = topic.icon;
                const content = (
                  <>
                    <div className="flex items-start justify-between gap-5">
                      <Icon
                        className="size-5 text-[#777] dark:text-[#858585]"
                        strokeWidth={1.55}
                        aria-hidden="true"
                      />
                      {topic.detail ? (
                        <span className="text-[10px] text-[#777] dark:text-[#858585]">
                          {topic.detail}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.035em]">
                      {topic.name}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8] sm:text-[13px]">
                      {topic.description}
                    </p>
                    {topic.href && (
                      <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium">
                        Start practicing
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                );

                if (!topic.href) {
                  return (
                    <article
                      key={topic.name}
                      className="min-h-[172px] cursor-not-allowed rounded-[12px] border border-black/[0.08] bg-black/[0.018] p-5 opacity-55 dark:border-white/[0.08] dark:bg-white/[0.018]"
                    >
                      {content}
                    </article>
                  );
                }

                return (
                  <Link
                    key={topic.name}
                    href={topic.href}
                    className="group min-h-[172px] rounded-[12px] border border-black/[0.11] bg-white/60 p-5 transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-black/25 hover:bg-white active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:bg-[#111] dark:hover:border-white/25 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
