"use client";

import { trackEvent } from "@/lib/analytics";
import type { Subject } from "@/lib/original-subjects";
import { isAvailable } from "@/lib/release-status";
import {
  ArrowRight,
  BrainCircuit,
  Braces,
  ChartScatter,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers3,
  Microchip,
  Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

type SubjectCategory = "core" | "advanced" | "development";
type DiagramType =
  | "operating-system"
  | "database"
  | "network"
  | "oop"
  | "dsa"
  | "system-design"
  | "web"
  | "computer-architecture"
  | "machine-learning"
  | "deep-learning";

const subjectDetails: Record<
  string,
  {
    icon: LucideIcon;
    category: SubjectCategory;
    visual: DiagramType;
  }
> = {
  "operating-systems": {
    icon: Cpu,
    category: "core",
    visual: "operating-system",
  },
  dbms: {
    icon: Database,
    category: "core",
    visual: "database",
  },
  "computer-networks": {
    icon: Network,
    category: "core",
    visual: "network",
  },
  oop: {
    icon: Braces,
    category: "core",
    visual: "oop",
  },
  "dsa-theory": {
    icon: GitBranch,
    category: "core",
    visual: "dsa",
  },
  "system-design": {
    icon: Layers3,
    category: "advanced",
    visual: "system-design",
  },
  "web-fundamentals": {
    icon: Code2,
    category: "development",
    visual: "web",
  },
  "machine-learning": {
    icon: ChartScatter,
    category: "advanced",
    visual: "machine-learning",
  },
  "deep-learning": {
    icon: BrainCircuit,
    category: "advanced",
    visual: "deep-learning",
  },
  "modern-computer-architecture": {
    icon: Microchip,
    category: "core",
    visual: "computer-architecture",
  },
};

function categoryLabel(category: SubjectCategory) {
  if (category === "core") return "CS Core";
  if (category === "advanced") return "Advanced";
  return "Development";
}

function SubjectDiagram({ type }: { type: DiagramType }) {
  const reduceMotion = useReducedMotion();
  const repeat = reduceMotion ? 0 : Infinity;

  if (type === "operating-system") {
    return (
      <div className="relative h-40 w-48" aria-hidden="true">
        <motion.div
          className="absolute inset-[18px] rounded-full border border-dashed border-foreground/20"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 16, ease: "linear", repeat }}
        >
          {[
            "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
            "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
            "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
            "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
          ].map((position, index) => (
            <span
              key={position}
              className={`absolute ${position} grid size-7 place-items-center rounded-lg border border-foreground/20 bg-[#f7f7f5] font-mono text-[8px] text-foreground/60 dark:bg-[#0a0a0a]`}
            >
              P{index + 1}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-foreground/25 bg-foreground/[0.035]"
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat }}
        >
          <Cpu className="size-5 text-foreground/60" strokeWidth={1.5} />
        </motion.div>
      </div>
    );
  }

  if (type === "computer-architecture") {
    return (
      <div
        className="relative flex h-40 w-48 flex-col items-center justify-center"
        aria-hidden="true"
      >
        <div className="flex items-center gap-5">
          {["A", "B"].map((register, index) => (
            <motion.span
              key={register}
              className="grid size-9 place-items-center rounded-lg border border-foreground/20 bg-[#f7f7f5] font-mono text-[9px] text-foreground/65 dark:bg-[#0a0a0a]"
              animate={reduceMotion ? undefined : { y: [0, index ? 3 : -3, 0] }}
              transition={{
                duration: 2.8,
                delay: index * 0.2,
                ease: "easeInOut",
                repeat,
              }}
            >
              R{register}
            </motion.span>
          ))}
        </div>
        <div className="flex h-6 items-center gap-[35px]">
          <span className="h-6 w-px -rotate-[24deg] bg-foreground/20" />
          <span className="h-6 w-px rotate-[24deg] bg-foreground/20" />
        </div>
        <motion.div
          className="grid h-12 w-20 place-items-center rounded-xl border border-foreground/25 bg-foreground/[0.035]"
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat }}
        >
          <div className="text-center">
            <Microchip
              className="mx-auto size-4 text-foreground/60"
              strokeWidth={1.5}
            />
            <span className="mt-0.5 block font-mono text-[8px] text-foreground/60">
              ALU
            </span>
          </div>
        </motion.div>
        <div className="h-4 w-px bg-foreground/20" />
        <div className="flex items-center gap-3 font-mono text-[8px] text-foreground/55">
          <span>OUT</span>
          <span className="size-1 rounded-full bg-foreground/35" />
          <span>FLAGS</span>
        </div>
      </div>
    );
  }

  if (type === "database") {
    return (
      <div
        className="relative flex h-40 w-48 flex-col justify-center gap-3 px-5"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map((row) => (
          <motion.div
            key={row}
            className="relative h-7 overflow-hidden rounded-full border border-foreground/20 bg-foreground/[0.025]"
            animate={reduceMotion ? undefined : { x: [0, row % 2 ? 5 : -5, 0] }}
            transition={{
              duration: 3.6,
              delay: row * 0.18,
              ease: "easeInOut",
              repeat,
            }}
          >
            <motion.span
              className="absolute inset-y-0 left-0 w-1/3 bg-foreground/[0.07]"
              animate={reduceMotion ? undefined : { x: ["-100%", "300%"] }}
              transition={{
                duration: 2.8,
                delay: row * 0.22,
                ease: "easeInOut",
                repeat,
                repeatDelay: 0.8,
              }}
            />
            <span className="absolute inset-y-1.5 left-3 w-px bg-foreground/20" />
            <span className="absolute inset-y-1.5 left-8 w-10 rounded-full bg-foreground/[0.08]" />
            <span className="absolute inset-y-1.5 right-4 w-7 rounded-full bg-foreground/[0.05]" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "network") {
    return (
      <div className="relative h-40 w-48" aria-hidden="true">
        <span className="absolute left-6 right-6 top-1/2 h-px bg-foreground/20" />
        <span className="absolute bottom-6 left-1/2 top-6 w-px bg-foreground/20" />
        <span className="absolute left-[42px] top-[42px] h-px w-[110px] rotate-[32deg] bg-foreground/15" />
        <span className="absolute left-[42px] bottom-[42px] h-px w-[110px] -rotate-[32deg] bg-foreground/15" />
        {[
          ["left-3", "top-1/2 -translate-y-1/2"],
          ["right-3", "top-1/2 -translate-y-1/2"],
          ["left-1/2 -translate-x-1/2", "top-3"],
          ["left-1/2 -translate-x-1/2", "bottom-3"],
          ["left-1/2 -translate-x-1/2", "top-1/2 -translate-y-1/2"],
        ].map(([x, y], index) => (
          <motion.span
            key={`${x}-${y}`}
            className={`absolute ${x} ${y} grid size-8 place-items-center rounded-full border border-foreground/25 bg-[#f7f7f5] dark:bg-[#0a0a0a]`}
            animate={reduceMotion ? undefined : { scale: [1, 1.14, 1] }}
            transition={{
              duration: 2.4,
              delay: index * 0.32,
              ease: "easeInOut",
              repeat,
            }}
          >
            <span className="size-1.5 rounded-full bg-foreground/50" />
          </motion.span>
        ))}
        <motion.span
          className="absolute left-[28px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground/55"
          animate={reduceMotion ? undefined : { x: [0, 132, 0] }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat }}
        />
      </div>
    );
  }

  if (type === "oop") {
    return (
      <div className="relative h-40 w-48" aria-hidden="true">
        <span className="absolute left-1/2 top-10 h-10 w-px -translate-x-1/2 bg-foreground/20" />
        <span className="absolute left-[23%] right-[23%] top-20 h-px bg-foreground/20" />
        <span className="absolute left-[23%] top-20 h-8 w-px bg-foreground/20" />
        <span className="absolute right-[23%] top-20 h-8 w-px bg-foreground/20" />
        <motion.div
          className="absolute left-1/2 top-2 flex h-9 w-20 -translate-x-1/2 items-center justify-center rounded-xl border border-foreground/25 bg-[#f7f7f5] font-mono text-xs dark:bg-[#0a0a0a]"
          animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 2.8, ease: "easeInOut", repeat }}
        >
          {"{ Base }"}
        </motion.div>
        {["left-2", "right-2"].map((position, index) => (
          <motion.div
            key={position}
            className={`absolute ${position} bottom-2 flex h-10 w-[76px] items-center justify-center rounded-xl border border-foreground/20 bg-[#f7f7f5] font-mono text-[9px] text-foreground/65 dark:bg-[#0a0a0a]`}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.45, 1, 0.45], y: [2, 0, 2] }
            }
            transition={{
              duration: 2.8,
              delay: 0.45 + index * 0.25,
              ease: "easeInOut",
              repeat,
            }}
          >
            {index === 0 ? "Child A" : "Child B"}
          </motion.div>
        ))}
        <motion.span
          className="absolute left-1/2 top-[42px] size-2 -translate-x-1/2 rounded-full bg-foreground/55"
          animate={
            reduceMotion ? undefined : { y: [0, 64], opacity: [0, 1, 0] }
          }
          transition={{ duration: 2.2, ease: "easeInOut", repeat }}
        />
      </div>
    );
  }

  if (type === "dsa") {
    const values = [8, 3, 6, 1, 7, 4];
    return (
      <div
        className="relative flex h-40 w-48 items-center justify-center"
        aria-hidden="true"
      >
        <div className="relative flex gap-1.5">
          {values.map((value, index) => (
            <motion.span
              key={value}
              className="grid size-6 place-items-center rounded-lg border border-foreground/20 font-mono text-[9px] text-foreground/65"
              animate={
                reduceMotion ? undefined : { y: [0, index % 2 ? -3 : 3, 0] }
              }
              transition={{
                duration: 2.6,
                delay: index * 0.12,
                ease: "easeInOut",
                repeat,
              }}
            >
              {value}
            </motion.span>
          ))}
          <motion.span
            className="absolute -bottom-4 left-0 h-0.5 w-6 rounded-full bg-foreground/55"
            animate={
              reduceMotion ? undefined : { x: [0, 30, 60, 90, 120, 150, 0] }
            }
            transition={{
              duration: 4.8,
              times: [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1],
              ease: "easeInOut",
              repeat,
            }}
          />
        </div>
      </div>
    );
  }

  if (type === "system-design") {
    return (
      <div className="relative h-40 w-48" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground/15" />
        <span className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground/15" />
        <motion.div
          className="absolute left-1/2 top-1/2 grid h-11 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-foreground/25 bg-[#f7f7f5] dark:bg-[#0a0a0a]"
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat }}
        >
          <Layers3 className="size-4 text-foreground/60" strokeWidth={1.5} />
        </motion.div>
        {[
          ["left-2", "top-3"],
          ["right-2", "top-3"],
          ["left-2", "bottom-3"],
          ["right-2", "bottom-3"],
        ].map(([x, y], index) => (
          <motion.span
            key={`${x}-${y}`}
            className={`absolute ${x} ${y} h-8 w-14 rounded-lg border border-foreground/20 bg-foreground/[0.025]`}
            animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.8,
              delay: index * 0.3,
              ease: "easeInOut",
              repeat,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "web") {
    return (
      <div
        className="relative flex h-40 w-48 items-center justify-center"
        aria-hidden="true"
      >
        <div className="relative flex items-center gap-2">
          {["HTML", "CSS", "JS"].map((label, index) => (
            <motion.span
              key={label}
              className="grid h-11 w-11 place-items-center rounded-xl border border-foreground/20 bg-[#f7f7f5] font-mono text-[8px] text-foreground/65 dark:bg-[#0a0a0a]"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -7, 0], opacity: [0.55, 1, 0.55] }
              }
              transition={{
                duration: 2.8,
                delay: index * 0.35,
                ease: "easeInOut",
                repeat,
              }}
            >
              {label}
            </motion.span>
          ))}
          <motion.div
            className="absolute -right-10 grid size-8 place-items-center rounded-full border border-foreground/25"
            animate={
              reduceMotion
                ? undefined
                : { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }
            }
            transition={{ duration: 3.2, ease: "easeInOut", repeat }}
          >
            <Code2 className="size-3.5 text-foreground/60" strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (type === "machine-learning") {
    const points = [
      [24, 116],
      [43, 103],
      [61, 109],
      [78, 82],
      [99, 75],
      [118, 59],
      [139, 52],
      [157, 32],
    ];

    return (
      <div className="relative h-40 w-48" aria-hidden="true">
        <span className="absolute bottom-5 left-4 top-4 w-px bg-foreground/25" />
        <span className="absolute bottom-5 left-4 right-3 h-px bg-foreground/25" />
        <motion.span
          className="absolute bottom-[72px] left-[18px] h-px w-[158px] origin-left -rotate-[31deg] bg-foreground/45"
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
        />
        {points.map(([x, y], index) => (
          <motion.span
            key={`${x}-${y}`}
            className="absolute size-2 rounded-full border border-foreground/35 bg-[#f7f7f5] dark:bg-[#0a0a0a]"
            style={{ left: x, top: y }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.3, 1], opacity: [0.55, 1, 0.55] }
            }
            transition={{
              duration: 2.6,
              delay: index * 0.16,
              ease: "easeInOut",
              repeat,
            }}
          />
        ))}
        <div className="absolute bottom-0 left-4 right-3 flex justify-between font-mono text-[7px] text-foreground/45">
          <span>DATA</span>
          <span>PREDICTION</span>
        </div>
      </div>
    );
  }

  if (type === "deep-learning") {
    const layers = [3, 4, 2];

    return (
      <div
        className="relative flex h-40 w-48 items-center justify-between px-4"
        aria-hidden="true"
      >
        <span className="absolute left-[42px] top-1/2 h-px w-[108px] -translate-y-1/2 bg-foreground/15" />
        <span className="absolute left-[39px] top-1/2 h-px w-[114px] -translate-y-1/2 rotate-[24deg] bg-foreground/15" />
        <span className="absolute left-[39px] top-1/2 h-px w-[114px] -translate-y-1/2 -rotate-[24deg] bg-foreground/15" />
        {layers.map((nodeCount, layerIndex) => (
          <div key={nodeCount} className="relative z-10 flex flex-col gap-2.5">
            {Array.from({ length: nodeCount }, (_, nodeIndex) => (
              <motion.span
                key={`${layerIndex}-${nodeIndex}`}
                className="size-5 rounded-full border border-foreground/25 bg-[#f7f7f5] dark:bg-[#0a0a0a]"
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.16, 1], opacity: [0.58, 1, 0.58] }
                }
                transition={{
                  duration: 2.5,
                  delay: layerIndex * 0.35 + nodeIndex * 0.12,
                  ease: "easeInOut",
                  repeat,
                }}
              />
            ))}
          </div>
        ))}
        <div className="absolute inset-x-4 bottom-0 flex justify-between font-mono text-[7px] text-foreground/45">
          <span>INPUT</span>
          <span>HIDDEN</span>
          <span>OUTPUT</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-40 w-48 items-center justify-center"
      aria-hidden="true"
    >
      <span className="absolute left-7 right-7 top-1/2 h-px bg-foreground/15" />
      <span className="absolute bottom-7 left-1/2 top-7 w-px bg-foreground/15" />
      {[
        "left-5 top-5",
        "right-5 top-5",
        "bottom-5 left-5",
        "bottom-5 right-5",
      ].map((position, index) => (
        <motion.span
          key={position}
          className={`absolute ${position} grid size-8 place-items-center rounded-full border border-foreground/20 bg-[#f7f7f5] dark:bg-[#0a0a0a]`}
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }
          }
          transition={{
            duration: 2.7,
            delay: index * 0.3,
            ease: "easeInOut",
            repeat,
          }}
        >
          <span className="size-1.5 rounded-full bg-foreground/50" />
        </motion.span>
      ))}
      <motion.div
        className="relative z-10 grid size-14 place-items-center rounded-2xl border border-foreground/25 bg-[#f7f7f5] dark:bg-[#0a0a0a]"
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat }}
      >
        <BrainCircuit className="size-5 text-foreground/60" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}

export function SubjectsPage({ subjects }: { subjects: Subject[] }) {
  const [activeSubjectSlug, setActiveSubjectSlug] = useState(subjects[0].slug);

  const activeSubject =
    subjects.find((subject) => subject.slug === activeSubjectSlug) ??
    subjects[0];

  const activeDetails = subjectDetails[activeSubject.slug] ?? subjectDetails["system-design"];
  const ActiveIcon = activeDetails.icon;
  const activeSubjectHref = `/subjects/${activeSubject.slug}`;
  const activeSubjectAvailable = isAvailable(activeSubject.availability);

  return (
    <>
      <section className="relative overflow-hidden border-b border-black/[0.06] px-5 py-12 font-[family-name:var(--font-geist-sans)] dark:border-white/[0.07] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(0,0,0,0.035),transparent_38%)] dark:bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.035),transparent_38%)]"
        />
        <div className="relative mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 font-[family-name:var(--font-geist-sans)] text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] sm:text-[11px]">
              <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
              Interview curriculum
            </div>
            <h1 className="mt-5 text-balance font-[family-name:var(--font-geist-sans)] text-[clamp(2.65rem,5vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Choose what
              <br />
              <span className="text-[#606060]">to prepare.</span>
            </h1>
            <p className="mt-5 max-w-xl font-[family-name:var(--font-geist-sans)] text-sm leading-7 text-[#606060] sm:text-[15px]">
              Build strong foundations, practise the questions that matter, and
              return whenever a concept needs revision.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Interview subjects"
        className="border-b border-black/[0.06] px-5 py-12 font-[family-name:var(--font-geist-sans)] dark:border-white/[0.07] sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="grid overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.05)] dark:border-white/[0.09] dark:bg-white/[0.09] dark:shadow-[0_25px_80px_rgba(0,0,0,0.24)] lg:grid-cols-[minmax(0,1fr)_370px]">
            <div className="relative hidden min-h-[520px] overflow-hidden bg-[#f7f7f5] p-6 dark:bg-[#0a0a0a] md:block md:p-9 lg:p-11">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubject.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex h-full min-h-[430px] flex-col"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl border border-black/[0.09] text-[#606060] dark:border-white/10">
                        <ActiveIcon
                          className="size-[19px]"
                          strokeWidth={1.55}
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className="font-[family-name:var(--font-geist-sans)] text-[9px] uppercase tracking-[0.16em] text-[#606060]">
                          {activeSubject.order} /{" "}
                          {categoryLabel(activeDetails.category)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid flex-1 items-center gap-10 sm:grid-cols-[1fr_190px]">
                    <div>
                      <h3 className="max-w-xl text-balance font-[family-name:var(--font-geist-sans)] text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                        {activeSubject.name}
                      </h3>
                      <p className="mt-5 max-w-lg font-[family-name:var(--font-geist-sans)] text-[13px] leading-7 text-[#606060]">
                        {activeSubject.description}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-[family-name:var(--font-geist-sans)] text-[10px] text-[#606060]">
                        {activeSubject.topics.map((topic, index) => (
                          <span
                            key={topic}
                            className="inline-flex items-center gap-3"
                          >
                            {topic}
                            {index < activeSubject.topics.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="size-0.5 rounded-full bg-current"
                              />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden justify-self-center opacity-70 sm:block">
                      <SubjectDiagram type={activeDetails.visual} />
                    </div>
                  </div>

                  <div
                    className={`flex items-center border-t border-black/[0.08] pt-6 dark:border-white/[0.09] ${
                      activeSubjectAvailable ? "justify-between" : "justify-end"
                    }`}
                  >
                    {activeSubjectAvailable && (
                      <p className="font-[family-name:var(--font-geist-sans)] text-[9px] text-[#606060]">
                        Learn, revise, recall, practise
                      </p>
                    )}
                    <Link
                      href={activeSubjectHref}
                      onClick={() =>
                        trackEvent("subject_select", {
                          subject_slug: activeSubject.slug,
                          subject_name: activeSubject.name,
                          availability: activeSubject.availability,
                          ui_location: "subjects_featured_panel",
                        })
                      }
                      className="group inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Explore {activeSubject.name}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <nav
              aria-label="Interview subjects"
              className="bg-[#f7f7f5] dark:bg-[#0a0a0a] md:border-t md:border-black/[0.08] md:dark:border-white/[0.09] lg:border-l lg:border-t-0"
            >
              {subjects.map((subject, index) => {
                const details = subjectDetails[subject.slug] ?? subjectDetails["system-design"];
                const Icon = details.icon;
                const selected = subject.slug === activeSubject.slug;
                const subjectHref = `/subjects/${subject.slug}`;
                const available = isAvailable(subject.availability);

                return (
                  <Link
                    key={subject.slug}
                    href={subjectHref}
                    onMouseEnter={() => setActiveSubjectSlug(subject.slug)}
                    onFocus={() => setActiveSubjectSlug(subject.slug)}
                    onClick={() =>
                      trackEvent("subject_select", {
                        subject_slug: subject.slug,
                        subject_name: subject.name,
                        availability: subject.availability,
                        ui_location: "subjects_list",
                      })
                    }
                    className={`group relative flex min-h-[74px] items-center gap-4 px-5 py-3 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                      available
                        ? "opacity-100"
                        : "opacity-45 hover:opacity-65 focus-visible:opacity-100"
                    } ${
                      index > 0
                        ? "border-t border-black/[0.08] dark:border-white/[0.09]"
                        : ""
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="active-subject-index-row"
                        className="absolute inset-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.055]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 35,
                        }}
                      />
                    )}

                    <span className="relative z-10 hidden font-[family-name:var(--font-geist-sans)] text-[9px] text-[#606060] md:inline">
                      {subject.order}
                    </span>
                    <span className="relative z-10 hidden size-8 place-items-center rounded-lg border border-black/[0.08] text-[#606060] transition-colors group-hover:text-foreground dark:border-white/[0.09] md:grid">
                      <Icon
                        className="size-3.5"
                        strokeWidth={1.55}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block truncate font-[family-name:var(--font-geist-sans)] text-sm font-medium">
                        {subject.name}
                      </span>
                    </span>
                    <ArrowRight
                      className={`relative z-10 size-3.5 text-[#606060] transition-[opacity,transform] ${
                        selected
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
