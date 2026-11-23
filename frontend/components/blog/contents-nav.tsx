"use client";

import { useEffect, useState } from "react";

const sections = [
  { number: "01", label: "The problem", id: "problem" },
  { number: "02", label: "Architecture", id: "architecture" },
  { number: "02a", label: "Deployment", id: "deployment" },
  { number: "02b", label: "Local setup", id: "local-stack" },
  { number: "03", label: "Content and data", id: "content" },
  { number: "04", label: "Practice tools", id: "practice" },
  { number: "04a", label: "Quiz grading", id: "quiz-grading" },
  { number: "04b", label: "DSA playback", id: "dsa-playback" },
  { number: "05", label: "Key outcomes", id: "outcomes" },
  { number: "06", label: "Checks and limits", id: "decisions" },
  { number: "07", label: "Future scope", id: "future" },
] as const;

export function ContentsNav({ compact = false }: { compact?: boolean }) {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const practiceChildren = sections.filter(
    (section) => section.id === "quiz-grading" || section.id === "dsa-playback",
  );
  const architectureChildren = sections.filter(
    (section) => section.id === "deployment" || section.id === "local-stack",
  );

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const marker = Math.max(160, window.innerHeight * 0.65);
      let current: string = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) {
          current = section.id;
        }
      }

      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = sections[sections.length - 1].id;
      }

      setActiveId(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const renderLink = (section: (typeof sections)[number], nested = false) => {
    const { number, label, id } = section;
    const active = activeId === id;

    return (
      <a
        key={id}
        href={`#${id}`}
        aria-current={active ? "location" : undefined}
        className={
          compact
            ? `shrink-0 rounded-[8px] border px-3 py-2 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                active
                  ? "border-black/20 bg-[#e7e7e4] font-medium text-[#151515] dark:border-white/25 dark:bg-[#242424] dark:text-white"
                  : "border-black/[0.12] text-[#555] hover:bg-black/[0.04] dark:border-white/[0.14] dark:text-[#b3b3b3] dark:hover:bg-white/[0.06]"
              }`
            : `flex min-w-0 items-center gap-3 rounded-[8px] px-3 py-2.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                nested ? "ml-4" : ""
              } ${
                active
                  ? "bg-black/[0.055] font-medium text-[#151515] dark:bg-white/[0.09] dark:text-white"
                  : "text-[#555] hover:bg-black/[0.045] hover:text-[#151515] dark:text-[#aaa] dark:hover:bg-white/[0.06] dark:hover:text-white"
              }`
        }
      >
        {!compact && (
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#888] dark:text-[#999]">
            {number}
          </span>
        )}
        <span className="truncate">{label}</span>
      </a>
    );
  };

  return (
    <nav
      aria-label="Article sections"
      className={
        compact
          ? "mt-7 flex gap-2 overflow-x-auto pb-2 lg:hidden"
          : "mt-4 grid grid-cols-1 gap-1"
      }
    >
      {sections
        .filter(
          (section) =>
            compact ||
            (section.id !== "deployment" &&
              section.id !== "local-stack" &&
              section.id !== "quiz-grading" &&
              section.id !== "dsa-playback"),
        )
        .map((section) =>
          (section.id === "practice" || section.id === "architecture") &&
          !compact ? (
            <div key={section.id}>
              {renderLink(section)}
              <div className="mt-1 grid gap-1">
                {(section.id === "architecture"
                  ? architectureChildren
                  : practiceChildren
                ).map((child) => renderLink(child, true))}
              </div>
            </div>
          ) : (
            renderLink(section)
          ),
        )}
    </nav>
  );
}
