import type { Metadata } from "next";
import { BinarySearchVisualizer } from "@/components/dsa/binary-search-visualizer";

export const metadata: Metadata = {
  title: "Binary Search Visualizer | PrepLoom",
  description:
    "See binary search one decision at a time. Explore custom inputs, moving pointers, and synchronized code with interactive playback.",
};

export default function BinarySearchPage() {
  return (
    <>
      <div className="mb-4">
        <p className="sr-only">Algorithm playground</p>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Binary search
            <span className="text-neutral-700 dark:text-neutral-400">.</span>
          </h1>
          <dl className="flex gap-6 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Time (worst)
              </dt>
              <dd className="font-mono text-sm font-medium">O(log n)</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">Space</dt>
              <dd className="font-mono text-sm font-medium">O(1)</dd>
            </div>
          </dl>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          One comparison. Half the possibilities. Watch the search space shrink.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500">
          Why use binary search?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          We use <strong>binary search</strong> to find a target value in a{" "}
          <strong>sorted array efficiently</strong>. Instead of checking every
          element one by one, binary search checks the middle element and
          eliminates half of the remaining search space based on whether the
          target is smaller or larger. This reduces the time complexity from{" "}
          <strong>O(n) to O(log n)</strong>, making it much faster for large
          datasets.
        </p>
      </details>
      <BinarySearchVisualizer />
      <section
        aria-label="Algorithm notes"
        className="mt-10 border-t border-black/10 py-8 dark:border-white/10"
      >
        <p className="text-xs leading-6 text-neutral-600 dark:text-neutral-400">
          n is the number of items. Best-case time: O(1). Requires ascending
          sorted input. With duplicates, this version returns a matching index,
          not necessarily the first. Space complexity refers to the algorithm;
          playback stores extra snapshots for rewinding.
        </p>
      </section>
    </>
  );
}
