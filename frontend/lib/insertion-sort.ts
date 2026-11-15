export type InsertionItem = { id: number; value: number };
export type InsertionStep = {
  items: (InsertionItem | null)[];
  held: InsertionItem | null;
  gap: number | null;
  i: number;
  j: number;
  sortedCount: number;
  comparisons: number;
  shifts: number;
  pass: number;
  status:
    | "ready"
    | "pick"
    | "compare"
    | "shift"
    | "move"
    | "place"
    | "insert"
    | "done";
  line: number;
  title: string;
  explanation: string;
};
export const insertionSortCode = [
  "def insertion_sort(a):",
  "    for i in range(1, len(a)):",
  "        key = a[i]",
  "        j = i - 1",
  "        while j >= 0 and a[j] > key:",
  "            a[j + 1] = a[j]",
  "            j -= 1",
  "        a[j + 1] = key",
  "    return a",
];
export function insertionSortSteps(values: number[]): InsertionStep[] {
  const items: (InsertionItem | null)[] = values.map((value, id) => ({
    value,
    id,
  }));
  const steps: InsertionStep[] = [];
  let held: InsertionItem | null = null,
    gap: number | null = null;
  let i = 0,
    j = -1,
    sortedCount = Math.min(1, values.length),
    comparisons = 0,
    shifts = 0;
  const push = (
    status: InsertionStep["status"],
    line: number,
    title: string,
    explanation: string,
  ) =>
    steps.push({
      items: items.map((item) => (item ? { ...item } : null)),
      held: held ? { ...held } : null,
      gap,
      i,
      j,
      sortedCount,
      comparisons,
      shifts,
      pass: i,
      status,
      line,
      title,
      explanation,
    });
  push(
    "ready",
    1,
    "Put each number where it belongs",
    values.length < 2
      ? "With fewer than two numbers, the list is already sorted."
      : `Start with ${values[0]}. Now take ${values[1]} and find where it belongs: before or after ${values[0]}? Then do the same with each number that comes next.`,
  );
  for (i = 1; i < items.length; i++) {
    held = items[i]!;
    items[i] = null;
    gap = i;
    j = i - 1;
    push(
      "pick",
      3,
      `Hold ${held.value} aside`,
      `We want to put ${held.value} in the right place among the numbers on its left. Hold it above the list for a moment. The empty space is where it came from.`,
    );
    while (j >= 0) {
      comparisons++;
      const value = items[j]!.value;
      push(
        "compare",
        5,
        `${value} ${value > held.value ? ">" : "≤"} ${held.value} → ${value > held.value ? "shift right" : "insert after it"}`,
        value > held.value
          ? `${held.value} needs to come before ${value}, because it is smaller. Move ${value} into the empty space on its right.`
          : `${value} is ${value === held.value ? "equal to" : "smaller than"} ${held.value}. The numbers before it are in order too. Put ${held.value} in the gap just after it.`,
      );
      if (value <= held.value) break;
      items[j + 1] = items[j];
      items[j] = null;
      gap = j;
      shifts++;
      push(
        "shift",
        6,
        `Move ${value} one place right`,
        `${value} moves right. The empty space is now one place further left. ${j === 0 ? `There are no more numbers to check on the left.` : `Keep holding ${held.value}; check the next number to the left.`}`,
      );
      j--;
    }
    push(
      "place",
      5,
      j < 0 ? "Insert at the start" : "We found the right place",
      j < 0
        ? `Nothing is left to check on the left. ${held.value} is smaller than all the numbers we moved, so put it at the start.`
        : gap === i
          ? `${held.value} is already in the right place. Put it back; no shifts were needed.`
          : `Put ${held.value} into position ${gap}, just after the number we checked.`,
    );
    const value = held.value;
    items[gap!] = held;
    held = null;
    gap = null;
    sortedCount = i + 1;
    push(
      "insert",
      8,
      `Put ${value} in the gap`,
      `${items
        .slice(0, sortedCount)
        .map((item) => item!.value)
        .join(
          ", ",
        )} - these numbers are now in order. ${sortedCount === items.length ? "We have used every number. We are done." : `Next, do the same with ${items[sortedCount]!.value}.`}`,
    );
  }
  push(
    "done",
    9,
    "The list is sorted",
    `Return the list from smallest to biggest. We used ${comparisons} comparisons and ${shifts} shifts.`,
  );
  return steps;
}
export function parseInsertionInput(input: string): number[] {
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
