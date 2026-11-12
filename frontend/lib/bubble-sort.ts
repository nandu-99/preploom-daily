export type BubbleItem = { id: number; value: number };
export type BubbleStep = {
  items: BubbleItem[];
  status: "ready" | "pass" | "compare" | "swap" | "keep" | "settled" | "done";
  pair: number | null;
  sortedFrom: number;
  pass: number;
  comparisons: number;
  swaps: number;
  passSwaps: number;
  line: number;
  title: string;
  explanation: string;
};

export const bubbleSortCode = [
  "def bubble_sort(a):",
  "    for end in range(len(a) - 1, 0, -1):",
  "        swapped = False",
  "        for j in range(end):",
  "            if a[j] > a[j + 1]:",
  "                a[j], a[j + 1] = a[j + 1], a[j]",
  "                swapped = True",
  "        if not swapped:",
  "            break",
  "    return a",
];

export function bubbleSortSteps(values: number[]): BubbleStep[] {
  const items = values.map((value, id) => ({ id, value }));
  const steps: BubbleStep[] = [];
  let comparisons = 0,
    swaps = 0,
    passSwaps = 0,
    pass = 0,
    sortedFrom = items.length;
  const push = (
    status: BubbleStep["status"],
    pair: number | null,
    line: number,
    title: string,
    explanation: string,
  ) => {
    steps.push({
      items: items.map((item) => ({ ...item })),
      status,
      pair,
      sortedFrom,
      pass,
      comparisons,
      swaps,
      passSwaps,
      line,
      title,
      explanation,
    });
  };
  push(
    "ready",
    null,
    1,
    "Put the numbers in order",
    "Sorting means putting numbers in order. We want smallest to biggest. Check two numbers next to each other; swap them only if the left one is bigger.",
  );
  for (let end = items.length - 1; end > 0; end--) {
    pass++;
    let swapped = false;
    passSwaps = 0;
    push(
      "pass",
      null,
      3,
      `Pass ${pass}: start from the left`,
      pass === 1
        ? "A pass is one trip across the numbers that still need sorting. Each swap moves the bigger number one place to the right."
        : `Start again from the left. Check marks show the finished positions on the right. Leave those alone.`,
    );
    for (let j = 0; j < end; j++) {
      const left = items[j].value,
        right = items[j + 1].value;
      comparisons++;
      push(
        "compare",
        j,
        5,
        `Compare ${left} and ${right}`,
        left > right
          ? `${left} is bigger than ${right}. They're in the wrong order. Next, swap their places.`
          : left === right
            ? "These numbers are equal. We can leave them where they are."
            : `${left} is smaller than ${right}. They're already in the right order.`,
      );
      if (left > right) {
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swaps++;
        passSwaps++;
        swapped = true;
        push(
          "swap",
          j,
          6,
          `Swap ${left} and ${right}`,
          `${right} belongs before ${left}. Exchange just these two numbers. The bigger one moves one position right.`,
        );
      }
    }
    sortedFrom = end;
    push(
      "settled",
      null,
      8,
      swapped
        ? `${items[end].value} is in its final place`
        : "A whole pass with no swaps",
      swapped
        ? `Each comparison kept the bigger number on the right, so the biggest reached index ${end}. ${end === 1 ? "Only one position is left; it must be correct too." : "The numbers before it may still need sorting. Start again from the left."}`
        : "Every pair we checked was already in order. The rest was finished on earlier passes, so we can stop.",
    );
    if (!swapped) {
      sortedFrom = 0;
      push(
        "done",
        null,
        9,
        "Everything is in order. We can stop.",
        "We made a whole pass without swapping anything. Every pair is in order, so the list is sorted.",
      );
      return steps;
    }
  }
  sortedFrom = 0;
  push(
    "done",
    null,
    10,
    "The list is sorted",
    items.length < 2
      ? "With fewer than two numbers, there's nothing to swap."
      : `Smallest to biggest, in ${comparisons} comparisons and ${swaps} swaps. Each pass put another number in its final place.`,
  );
  return steps;
}

export function parseBubbleInput(input: string): number[] {
  const parts = input.split(",").map((part) => part.trim());
  if (parts.length > 12 || parts.some((part) => !/^-?\d+$/.test(part)))
    throw new Error("Enter 1–12 whole numbers, separated by commas.");
  const values = parts.map(Number);
  if (
    values.some((value) => !Number.isSafeInteger(value) || Math.abs(value) > 99)
  )
    throw new Error("Use numbers between -99 and 99.");
  return values;
}
