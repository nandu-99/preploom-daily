import { parseMergeInput } from "@/lib/merge-sort";
import type { Metadata } from "next";
import { MergeSortVisualizer } from "@/components/dsa/merge-sort-visualizer";

export const metadata: Metadata = {
  title: "Merge Sort Visualizer | PrepLoom",
  description:
    "Learn merge sort with moving numbers, pair comparisons, Python code, and optional voice explanations.",
};

export default async function MergeSortPage({
  searchParams,
}: {
  searchParams: Promise<{ input?: string | string[] }>;
}) {
  const { input } = await searchParams;
  let initialValues: number[] | undefined;
  let inputError = "";
  if (input !== undefined) {
    try {
      if (typeof input !== "string") throw new Error("Use one input list.");
      initialValues = parseMergeInput(input);
    } catch {
      inputError = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Merge sort<span className="text-neutral-500">.</span>
          </h1>
          <dl className="flex gap-6 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Time (worst)
              </dt>
              <dd className="font-mono text-sm font-medium">O(n log n)</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">Space</dt>
              <dd className="font-mono text-sm font-medium">O(n)</dd>
            </div>
          </dl>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Split into small groups. Join them back in order.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          Why learn merge sort?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Merge sort splits a list into smaller groups until each has one
          number. Then it joins them in order: compare the first number left in
          each group and take the smaller one. Repeat until the whole list is
          sorted. Its predictable O(n log n) time makes it useful for larger
          lists, but it needs extra memory.
        </p>
      </details>
      {inputError && (
        <p role="alert" className="mb-3 text-sm">
          {inputError}
        </p>
      )}
      <MergeSortVisualizer
        key={initialValues?.join(",") ?? "default"}
        initialValues={initialValues}
      />
      <p className="mt-8 border-t border-black/10 py-6 text-xs leading-6 text-neutral-600 dark:border-white/10 dark:text-neutral-400">
        n is the number of items. Best, average, and worst-case time: O(n log
        n). Each split roughly halves a group, and joining each level processes
        all its numbers. Auxiliary space: O(n), plus O(log n) call depth. Equal
        values keep their original order because ties are taken from the left
        first. Playback snapshots use additional memory. Comparisons count
        checks between values; placements count values added to merged lists.
      </p>
    </>
  );
}
