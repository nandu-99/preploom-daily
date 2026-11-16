import { ExtraVisualizer } from "@/components/dsa/extra-visualizer";
import {
  parseVisualArray,
  parseVisualTarget,
} from "@/lib/extra-visualizations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linear Search Visualizer | PrepLoom",
  description:
    "Follow linear search one comparison at a time with an animated array and matching Python code.",
};

export default async function LinearSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    input?: string | string[];
    target?: string | string[];
  }>;
}) {
  const { input, target } = await searchParams;
  let initialValues: number[] | undefined;
  let initialTarget: number | undefined;
  let error = "";
  if (input !== undefined || target !== undefined) {
    try {
      if (typeof input !== "string" || typeof target !== "string")
        throw new Error("Use one array and one target.");
      initialValues = parseVisualArray(input, 12);
      initialTarget = parseVisualTarget(target);
    } catch {
      error = "That shared input is invalid. Showing the example instead.";
    }
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
            Linear search<span className="text-neutral-500">.</span>
          </h1>
          <dl className="flex gap-6 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">
                Time (worst)
              </dt>
              <dd className="font-mono text-sm font-medium">O(n)</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">Space</dt>
              <dd className="font-mono text-sm font-medium">O(1)</dd>
            </div>
          </dl>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Check each position from left to right until the target appears.
        </p>
      </div>
      <details className="mb-4 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-xs font-medium">
          Why use linear search?
        </summary>
        <p className="px-4 pb-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Linear search works on an unsorted array and returns the first
          matching position. In the worst case it checks every value. Watch the
          current position and the highlighted line move together.
        </p>
      </details>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      <ExtraVisualizer
        key={`${initialValues?.join(",") ?? "default"}:${initialTarget ?? "default"}`}
        algorithm="linear"
        initialValues={initialValues}
        initialTarget={initialTarget}
      />
    </>
  );
}
