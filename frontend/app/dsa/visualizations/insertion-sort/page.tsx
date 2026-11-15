import { parseInsertionInput } from "@/lib/insertion-sort";
import type { Metadata } from "next";
import { InsertionSortVisualizer } from "@/components/dsa/insertion-sort-visualizer";

export const metadata: Metadata = {
  title: "Insertion Sort Visualizer | PrepLoom",
  description:
    "Learn insertion sort with moving numbers, pair comparisons, Python code, and optional voice explanations.",
};

export default async function InsertionSortPage({
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
      initialValues = parseInsertionInput(input);
    } catch {
      inputError = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Insertion sort<span className="text-neutral-500">.</span>
          </h1>
          <dl className="flex gap-6 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Time (worst)
              </dt>
              <dd className="font-mono text-sm font-medium">O(n²)</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">Space</dt>
              <dd className="font-mono text-sm font-medium">O(1)</dd>
            </div>
          </dl>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Take the next number. Make room. Put it in the right place.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          Why learn insertion sort?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Insertion sort builds a sorted section from left to right. Take the
          next number, move bigger numbers one position right, and put your
          number into the space left behind. It can work well when a list is
          small or nearly sorted.
        </p>
      </details>
      {inputError && (
        <p role="alert" className="mb-3 text-sm">
          {inputError}
        </p>
      )}
      <InsertionSortVisualizer
        key={initialValues?.join(",") ?? "default"}
        initialValues={initialValues}
      />
      <p className="mt-8 border-t border-black/10 py-6 text-xs leading-6 text-neutral-600 dark:border-white/10 dark:text-neutral-400">
        n is the number of items. Best-case time: O(n) for an already sorted
        list. Average and worst-case time: O(n²). Extra space: O(1). Equal
        numbers keep their original order because we only shift strictly bigger
        numbers. Comparisons count number-to-key checks. The gap represents the
        next write position; Python keeps key separately and copies values
        during shifts. Playback stores extra snapshots for rewinding.
      </p>
    </>
  );
}
