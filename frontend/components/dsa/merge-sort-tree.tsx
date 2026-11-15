"use client";

import { motion } from "motion/react";
import type { MergeStep } from "@/lib/merge-sort";

type Group = { start: number; count: number; depth: number; parent?: string };
const idOf = (group: Group) => `${group.start}:${group.count}`;

/** Fixed tree geometry; each input item owns one persistent moving tile. */
export function MergeSortTree({
  values,
  steps,
  step,
  duration,
  showIdentity,
}: {
  values: number[];
  steps: MergeStep[];
  step: MergeStep;
  duration: number;
  showIdentity: boolean;
}) {
  const groups: Group[] = [];
  function divide(
    start: number,
    count: number,
    depth: number,
    parent?: string,
  ) {
    const group = { start, count, depth, parent };
    groups.push(group);
    if (count > 1) {
      const half = Math.floor(count / 2);
      divide(start, half, depth + 1, idOf(group));
      divide(start + half, count - half, depth + 1, idOf(group));
    }
  }
  divide(0, values.length, 0);
  const history = steps.slice(0, steps.indexOf(step) + 1);
  const split = new Set(
    history
      .filter((s) => s.status === "split")
      .map((s) => `${s.start}:${s.group.length}`),
  );
  const sorted = new Map(
    history
      .filter((s) => s.status === "merged" || s.status === "done")
      .map((s) => [`${s.start}:${s.group.length}`, s.output]),
  );
  const visible = groups.filter((g) => !g.parent || split.has(g.parent));
  const joining = ["merge", "compare", "take", "rest"].includes(step.status);
  const active = groups.find(
    (g) => g.start === step.start && g.count === step.group.length,
  )!;
  const width = Math.max(480, values.length * 54);
  const levels = Math.max(...groups.map((g) => g.depth));
  const rowHeight = 112,
    topPadding = 76,
    tileSize = 34,
    tilePitch = 40;
  const center = (g: Group) =>
    ((g.start + g.count / 2) / values.length) * width;
  const top = (g: Group) => topPadding + g.depth * rowHeight;
  const left = (g: Group, index: number) =>
    center(g) + (index - (g.count - 1) / 2) * tilePitch - tileSize / 2;
  const contains = (g: Group, id: number) =>
    id >= g.start && id < g.start + g.count;
  const positions = values.map((value, id) => {
    const out = joining ? step.output.findIndex((item) => item.id === id) : -1;
    if (out >= 0) return { id, value, group: active, index: out, next: false };
    const finished = visible
      .filter((g) => contains(g, id) && sorted.has(idOf(g)))
      .sort((a, b) => a.depth - b.depth)[0];
    const group =
      finished ??
      visible
        .filter((g) => contains(g, id))
        .sort((a, b) => b.depth - a.depth)[0];
    const items = sorted.get(idOf(group));
    const index = items
      ? items.findIndex((item) => item.id === id)
      : id - group.start;
    const next =
      joining &&
      (step.left[step.l]?.id === id || step.right[step.r]?.id === id);
    return { id, value, group, index, next };
  });
  return (
    <div
      className="overflow-x-auto rounded-xl border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950"
      tabIndex={0}
      aria-label="Merge sort: numbers split downward and merge upward"
    >
      <div
        className="relative mx-auto"
        style={{
          width,
          minWidth: width,
          height: topPadding + levels * rowHeight + 92,
        }}
      >
        <div className="absolute inset-x-4 top-3 flex h-11 items-center justify-center text-center text-sm font-medium">
          {step.status === "done"
            ? "Finished: the sorted array is at the top"
            : joining
              ? "Compare the highlighted numbers → move the smaller one up"
              : step.status === "merged"
                ? "This group is sorted. Keep it here for the next merge."
                : "Split the array down into smaller groups. Keep every group visible."}
        </div>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {visible
            .filter((g) => g.parent)
            .map((g) => {
              const parent = groups.find((p) => idOf(p) === g.parent)!;
              return (
                <motion.path
                  key={idOf(g)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration }}
                  d={`M ${center(parent)} ${top(parent) + 60} V ${top(g) - 24} H ${center(g)} V ${top(g) - 8}`}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.2}
                />
              );
            })}
        </svg>
        {visible.map((g) => {
          const occupied = positions.some((p) => idOf(p.group) === idOf(g));
          const current = idOf(g) === idOf(active);
          return (
            <div
              key={idOf(g)}
              className={`absolute h-11 rounded-lg border ${current ? "border-neutral-600 dark:border-neutral-300" : "border-dashed border-neutral-300 dark:border-neutral-700"}`}
              style={{
                left: center(g) - (g.count * tilePitch) / 2 - 3,
                top: top(g) - 4,
                width: g.count * tilePitch + 6,
              }}
            >
              <div className="absolute inset-x-[-16px] top-[50px] h-5 text-center text-[11px] text-neutral-500">
                {current && joining
                  ? "Build sorted group here"
                  : sorted.has(idOf(g)) && occupied
                    ? g.depth === 0
                      ? "Sorted array"
                      : "Sorted ✓"
                    : occupied && g.count === 1
                      ? "One number"
                      : g.depth === 0
                        ? "Original array"
                        : ""}
              </div>
            </div>
          );
        })}
        {positions.map((p) => (
          <motion.div
            key={p.id}
            initial={false}
            animate={{ left: left(p.group, p.index), top: top(p.group) }}
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-10 flex h-[34px] w-[34px] items-center justify-center"
            aria-label={`Value ${p.value}${p.next ? ", next number to compare" : ""}`}
          >
            <span
              className={`flex h-full w-full items-center justify-center rounded-md border font-mono text-sm ${p.next ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black" : "border-neutral-400 bg-white dark:border-neutral-500 dark:bg-neutral-900"}`}
            >
              {p.value}
              {showIdentity && (
                <small className="ml-0.5 text-[8px]">#{p.id}</small>
              )}
            </span>
            {p.next && (
              <span className="absolute -top-6 whitespace-nowrap rounded bg-neutral-50 px-1 text-[10px] dark:bg-neutral-950">
                Compare
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
