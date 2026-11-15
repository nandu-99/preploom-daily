"use client";

import { ArrowRight, Braces, Code2, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type Roadmap = {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: "Code2" | "Database" | "Braces";
  stages: Array<{
    title: string;
    description: string;
    topics: string;
  }>;
};

const iconMap: Record<Roadmap["icon"], LucideIcon> = {
  Code2,
  Database,
  Braces,
};

export function RoadmapExplorer({ roadmaps }: { roadmaps: Roadmap[] }) {
  const [activeId, setActiveId] = useState(roadmaps[0]?.id ?? "");
  const reduceMotion = useReducedMotion();
  const activeRoadmap =
    roadmaps.find((roadmap) => roadmap.id === activeId) ?? roadmaps[0];
  if (!activeRoadmap) return null;
  const ActiveIcon = iconMap[activeRoadmap.icon];

  return (
    <div className="grid overflow-hidden rounded-[20px] border border-black/[0.1] bg-black/[0.025] dark:border-white/[0.11] dark:bg-white/[0.025] lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="border-b border-black/[0.09] bg-[#ededeb]/55 p-3 dark:border-white/[0.1] dark:bg-[#121212] lg:border-b-0 lg:border-r lg:p-4">
        <div className="px-3 pb-4 pt-3">
          <p className="text-[12px] font-medium">Choose your goal</p>
          <p className="mt-1 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
            You can change paths at any time.
          </p>
        </div>

        <div className="grid gap-1.5" role="tablist" aria-label="Roadmaps">
          {roadmaps.map((roadmap) => {
            const Icon = iconMap[roadmap.icon];
            const active = roadmap.id === activeRoadmap.id;

            return (
              <button
                key={roadmap.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="selected-roadmap"
                onClick={() => setActiveId(roadmap.id)}
                className={`group grid min-h-[82px] w-full grid-cols-[40px_1fr_auto] items-center gap-3 rounded-[12px] px-3 py-3 text-left transition-[background-color,color,transform] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                  active
                    ? "bg-[#f7f7f5] text-[#151515] shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:bg-[#202020] dark:text-[#f3f3f1]"
                    : "text-[#606060] hover:bg-black/[0.035] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:bg-white/[0.045] dark:hover:text-white"
                }`}
              >
                <span className="grid size-10 place-items-center rounded-[10px] border border-black/[0.09] bg-black/[0.02] dark:border-white/[0.1] dark:bg-white/[0.035]">
                  <Icon
                    className="size-[18px]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium">
                    {roadmap.name}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#777] dark:text-[#858585]">
                    {roadmap.label}
                  </span>
                </span>
                <ArrowRight
                  className={`size-4 transition-transform ${
                    active
                      ? "translate-x-0"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="selected-roadmap"
        role="tabpanel"
        className="min-w-0 bg-[#f7f7f5] p-5 dark:bg-[#0a0a0a] sm:p-8 lg:p-11"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeRoadmap.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
            transition={{
              duration: reduceMotion ? 0 : 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="border-b border-black/[0.09] pb-8 dark:border-white/[0.1]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-[10px] border border-black/[0.1] dark:border-white/[0.11]">
                    <ActiveIcon
                      className="size-[18px]"
                      strokeWidth={1.55}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                    {activeRoadmap.label}
                  </span>
                </div>
                <h2 className="mt-6 text-balance text-[clamp(2.1rem,4vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  {activeRoadmap.name}
                </h2>
                <p className="mt-4 max-w-[58ch] text-[14px] leading-7 text-[#555] dark:text-[#b3b3b3]">
                  {activeRoadmap.description}
                </p>
              </div>
            </div>

            <ol className="mt-8">
              {activeRoadmap.stages.map((stage, index) => (
                <li
                  key={stage.title}
                  className="group relative grid grid-cols-[34px_minmax(0,1fr)] gap-4 pb-9 last:pb-0 sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-6 sm:pb-10"
                >
                  {index < activeRoadmap.stages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[16.5px] top-9 w-px bg-black/[0.12] dark:bg-white/[0.14] sm:left-[20.5px] sm:top-11"
                    />
                  )}
                  <span className="relative grid size-[34px] place-items-center rounded-[9px] border border-black/[0.12] bg-[#f7f7f5] text-[11px] font-medium text-[#606060] dark:border-white/[0.14] dark:bg-[#0a0a0a] dark:text-[#a8a8a8] sm:size-[42px] sm:rounded-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-1 sm:pt-1.5">
                    <h3 className="text-[16px] font-medium tracking-[-0.02em] sm:text-[17px]">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 max-w-[55ch] text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8] sm:text-[13px]">
                      {stage.description}
                    </p>
                    <div className="mt-4 border-l-2 border-black/[0.14] pl-4 dark:border-white/[0.16]">
                      <p className="text-[11px] font-medium text-[#505050] dark:text-[#b8b8b8]">
                        Know these before moving on
                      </p>
                      <p className="mt-1.5 max-w-[78ch] text-[12px] leading-6 text-[#777] dark:text-[#999] sm:text-[13px]">
                        {stage.topics}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
