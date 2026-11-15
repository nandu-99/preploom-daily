export type SelectionItem = { id: number; value: number };
export type SelectionStep = {
  items: SelectionItem[];
  status:
    | "ready"
    | "pass"
    | "compare"
    | "minimum"
    | "keep"
    | "decision"
    | "swap"
    | "settled"
    | "done";
  start: number;
  minIndex: number | null;
  scan: number | null;
  sortedCount: number;
  pass: number;
  comparisons: number;
  swaps: number;
  line: number;
  title: string;
  explanation: string;
};
export const selectionSortCode = [
  "def selection_sort(a):",
  "    for start in range(len(a) - 1):",
  "        min_index = start",
  "        for j in range(start + 1, len(a)):",
  "            if a[j] < a[min_index]:",
  "                min_index = j",
  "        if min_index != start:",
  "            a[start], a[min_index] = a[min_index], a[start]",
  "    return a",
];
export function selectionSortSteps(values: number[]): SelectionStep[] {
  const items = values.map((value, id) => ({ id, value }));
  const steps: SelectionStep[] = [];
  let start = 0,
    minIndex: number | null = null,
    scan: number | null = null,
    sortedCount = 0,
    pass = 0,
    comparisons = 0,
    swaps = 0;
  const push = (
    status: SelectionStep["status"],
    line: number,
    title: string,
    explanation: string,
  ) =>
    steps.push({
      items: items.map((item) => ({ ...item })),
      status,
      start,
      minIndex,
      scan,
      sortedCount,
      pass,
      comparisons,
      swaps,
      line,
      title,
      explanation,
    });
  push(
    "ready",
    1,
    "Find the smallest. Put it first.",
    "We'll put the numbers in order from smallest to biggest. Find the smallest number in the unfinished part, then put it in the first unfinished position.",
  );
  for (start = 0; start < items.length - 1; start++) {
    pass++;
    minIndex = start;
    scan = null;
    push(
      "pass",
      3,
      `Fill position ${start}`,
      `Start by remembering ${items[start].value} as the smallest so far. Now check every number to its right. Don't swap anything yet.`,
    );
    for (let j = start + 1; j < items.length; j++) {
      scan = j;
      comparisons++;
      const candidate = items[j].value,
        smallest = items[minIndex].value;
      push(
        "compare",
        5,
        `Compare ${candidate} with ${smallest}`,
        candidate < smallest
          ? `${candidate} is smaller than our current choice, ${smallest}. Remember its position next.`
          : candidate === smallest
            ? "These values are equal. Keep the earlier choice and continue looking."
            : `${candidate} is bigger. Keep ${smallest} as the smallest so far.`,
      );
      if (candidate < smallest) {
        minIndex = j;
        push(
          "minimum",
          6,
          `${candidate} is the smallest so far`,
          "Move the minimum marker to this number. The numbers stay where they are; we're only remembering a better choice.",
        );
      }
    }
    scan = null;
    push(
      "decision",
      7,
      minIndex === start ? "No swap needed" : "Ready to swap",
      minIndex === start
        ? "The smallest is already in the position we are filling. No swap needed."
        : `We checked this whole part. ${items[minIndex].value} is the smallest. Now exchange it with ${items[start].value}.`,
    );
    if (minIndex !== start) {
      const smallest = items[minIndex].value,
        displaced = items[start].value;
      [items[start], items[minIndex]] = [items[minIndex], items[start]];
      swaps++;
      push(
        "swap",
        8,
        `Put ${smallest} in position ${start}`,
        `We've checked the whole unfinished part. Swap ${smallest} with ${displaced}, which is in the position we're filling.`,
      );
    }
    sortedCount = start + 1;
    minIndex = start;
    push(
      "settled",
      sortedCount === items.length - 1 ? 9 : 2,
      `${items[start].value} is in its final place`,
      `This is the smallest number from the part we checked. ${sortedCount === items.length - 1 ? "Only one number is left, so it must be in the right place too." : "Leave this position alone and repeat with the numbers to its right."}`,
    );
  }
  sortedCount = items.length;
  minIndex = null;
  scan = null;
  push(
    "done",
    9,
    "The list is sorted",
    items.length < 2
      ? "There's nothing to compare or swap. Return the list as it is."
      : `Smallest to biggest, using ${comparisons} comparisons and ${swaps} swaps. We placed one smallest number at a time.`,
  );
  return steps;
}

export function parseSelectionInput(input: string): number[] {
  const parts = input.split(",").map((part) => part.trim());
  if (parts.length > 12 || parts.some((part) => !/^-?\d+$/.test(part)))
    throw new Error("Enter 1-12 whole numbers, separated by commas.");
  const values = parts.map(Number);
  if (
    values.some((value) => !Number.isSafeInteger(value) || Math.abs(value) > 99)
  )
    throw new Error("Use numbers between -99 and 99.");
  return values;
}
