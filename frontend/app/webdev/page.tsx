import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WebdevHub, WebdevHubSkeleton } from "@/components/webdev/webdev-hub";
import type { Metadata } from "next";
import {
  FileCode2,
  FolderKanban,
  Globe2,
  Layers3,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getWebdevContent } from "@/lib/webdev-content";

export const metadata: Metadata = {
  title: "Web Development Resources | PrepLoom",
  description:
    "Useful websites, project ideas, component libraries, practical guides, and coding skills for web developers.",
};

const sections = [
  {
    id: "websites",
    label: "Useful websites",
    detail: "Docs and tools",
    icon: Globe2,
  },
  {
    id: "projects",
    label: "Project ideas",
    detail: "Ideas with scope",
    icon: FolderKanban,
  },
  {
    id: "libraries",
    label: "Component libraries",
    detail: "Trusted UI systems",
    icon: Layers3,
  },
  {
    id: "guides",
    label: "Curated collections",
    detail: "Setup and deployment",
    icon: TerminalSquare,
  },
  {
    id: "skills",
    label: "Skills.md",
    detail: "Claude and Codex",
    icon: FileCode2,
  },
];

export const dynamic = "force-dynamic";

export default async function WebdevPage() {
  const content = await getWebdevContent();
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#hybrid-webdev-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="hybrid-webdev-main">
        <section className="relative overflow-hidden px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_77%_30%,rgba(0,0,0,0.045),transparent_33%)] dark:bg-[radial-gradient(circle_at_77%_30%,rgba(255,255,255,0.038),transparent_33%)]"
          />
          <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end lg:gap-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                Web developer resources
              </div>
              <h1 className="mt-6 text-balance text-[clamp(3rem,6.2vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Build for the web,
                <span className="block text-[#777] dark:text-[#858585]">
                  with less searching.
                </span>
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3] sm:text-[17px] sm:leading-8">
                Find trusted resources, project ideas, setup guides, and focused
                coding skills.
              </p>
            </div>

            <div className="border-y border-black/[0.1] py-2 dark:border-white/[0.11]">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.label}
                    href={`/webdev?tab=${section.id}#webdev-resources`}
                    className="group grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-black/[0.08] py-3.5 transition-colors last:border-b-0 hover:text-[#555] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/40 dark:border-white/[0.09] dark:hover:text-[#b3b3b3] dark:focus-visible:ring-white/50"
                  >
                    <Icon
                      className="size-4 text-[#777] transition-colors group-hover:text-[#555] dark:text-[#858585] dark:group-hover:text-[#b3b3b3]"
                      strokeWidth={1.55}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] font-medium">
                      {section.label}
                    </span>
                    <span className="text-[10px] text-[#777] dark:text-[#858585]">
                      {section.detail}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <Suspense fallback={<WebdevHubSkeleton />}>
          {content ? <WebdevHub data={content} /> : <p className="py-8 text-sm">Resources are unavailable right now.</p>}
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
