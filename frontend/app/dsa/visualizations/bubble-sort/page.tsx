import { parseBubbleInput } from "@/lib/bubble-sort";
import type { Metadata } from "next";
import { BubbleSortVisualizer } from "@/components/dsa/bubble-sort-visualizer";

export const metadata: Metadata = {
  title: "Bubble Sort Visualizer | PrepLoom",
  description:
    "Learn bubble sort with moving numbers, pair comparisons, Python code, and optional voice explanations.",
};

export default async function BubbleSortPage({
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
      initialValues = parseBubbleInput(input);
    } catch {
      inputError = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Bubble sort<span className="text-neutral-500">.</span>
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
          Compare two neighbors. Swap if needed. Watch the biggest move right.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          Why learn bubble sort?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Bubble sort is a simple way to understand sorting. Look at two numbers
          next to each other. If the left one is bigger, swap them. Keep going,
          then start again from the left. It is useful for learning, but it
          needs many comparisons on large lists, so faster sorting algorithms
          are usually a better choice for those.
        </p>
      </details>
      {inputError && (
        <p role="alert" className="mb-3 text-sm">
          {inputError}
        </p>
      )}
      <BubbleSortVisualizer
        key={initialValues?.join(",") ?? "default"}
        initialValues={initialValues}
      />
      <p className="mt-8 border-t border-black/10 py-6 text-xs leading-6 text-neutral-600 dark:border-white/10 dark:text-neutral-400">
        n is the number of items. Best-case time: O(n) for an already sorted
        list, because this version stops after a pass with no swaps. Equal
        values keep their original order. O(1) space describes the algorithm;
        the visualizer stores extra snapshots so you can rewind.
      </p>
    </>
  );
}
