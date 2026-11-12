import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VisualizationNav } from "@/components/dsa/visualization-nav";

export default function VisualizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-[1800px] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          aria-label="Visualization lessons"
          className="border-b border-black/10 px-5 py-5 dark:border-white/10 lg:sticky lg:top-[68px] lg:h-[calc(100dvh-68px)] lg:border-b-0 lg:border-r lg:px-3"
        >
          <Link
            href="/subjects"
            className="block px-3 text-xs text-neutral-600 hover:underline dark:text-neutral-400"
          >
            Back to subjects
          </Link>
          <h2 className="mt-7 px-3 text-sm font-semibold">Visualizations</h2>
          <VisualizationNav />
        </aside>
        <main
          id="visualizer-main"
          className="min-w-0 px-4 py-6 sm:px-6 lg:px-7"
        >
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
