import { ExtraVisualizer } from "@/components/dsa/extra-visualizer";
import { parseVisualArray } from "@/lib/extra-visualizations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Sort Visualizer | PrepLoom",
  description:
    "See quick sort choose pivots, partition values, and sort smaller ranges with synchronized Python code.",
};

export default async function QuickSortPage({
  searchParams,
}: {
  searchParams: Promise<{ input?: string | string[] }>;
}) {
  const { input } = await searchParams;
  let initialValues: number[] | undefined;
  let error = "";
  if (input !== undefined) {
    try {
      if (typeof input !== "string") throw new Error("Use one array.");
      initialValues = parseVisualArray(input, 10);
    } catch {
      error = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Quick sort<span className="text-neutral-500">.</span>
          </h1>
          <dl className="flex gap-6 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Time (average)
              </dt>
              <dd className="font-mono text-sm font-medium">O(n log n)</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Space (average)
              </dt>
              <dd className="font-mono text-sm font-medium">O(log n)</dd>
            </div>
          </dl>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Choose a pivot, move smaller values left, then sort the two sides.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          How does quick sort work?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          This version uses the last value in each range as the pivot. The
          partition step places it in its final position. Then the same process
          sorts the left and right ranges. With poor pivots, time and recursion
          space can rise to O(n²) and O(n).
        </p>
      </details>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      <ExtraVisualizer
        key={initialValues?.join(",") ?? "default"}
        algorithm="quick"
        initialValues={initialValues}
      />
    </>
  );
}
