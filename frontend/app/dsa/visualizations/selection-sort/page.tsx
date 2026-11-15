import { parseSelectionInput } from "@/lib/selection-sort";
import type { Metadata } from "next";
import { SelectionSortVisualizer } from "@/components/dsa/selection-sort-visualizer";

export const metadata: Metadata = {
  title: "Selection Sort Visualizer | PrepLoom",
  description:
    "Learn selection sort with moving numbers, pair comparisons, Python code, and optional voice explanations.",
};

export default async function SelectionSortPage({
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
      initialValues = parseSelectionInput(input);
    } catch {
      inputError = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Selection sort<span className="text-neutral-500">.</span>
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
          Find the smallest. Put it first. Repeat with the numbers left.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          Why learn selection sort?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Selection sort puts numbers in order by choosing the smallest number
          from the part that still needs sorting. It checks that whole part,
          then makes at most one swap to put the chosen number first. It is
          useful for learning, but it needs many comparisons on large lists.
        </p>
      </details>
      {inputError && (
        <p role="alert" className="mb-3 text-sm">
          {inputError}
        </p>
      )}
      <SelectionSortVisualizer
        key={initialValues?.join(",") ?? "default"}
        initialValues={initialValues}
      />
      <p className="mt-8 border-t border-black/10 py-6 text-xs leading-6 text-neutral-600 dark:border-white/10 dark:text-neutral-400">
        n is the number of items. Best, average, and worst-case time: O(n²).
        This version still checks every remaining number even if the list is
        already sorted. It makes at most n − 1 swaps. Equal values may change
        their original order during a swap. O(1) space describes the algorithm;
        playback stores extra snapshots for rewinding.
      </p>
    </>
  );
}
