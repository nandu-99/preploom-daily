export type VisualItem = { id: number; value: number };
export type VisualStep = {
  items: VisualItem[];
  line: number;
  title: string;
  explanation: string;
  phase: string;
  active: number | null;
  pivot: number | null;
  boundary: number | null;
  range: [number, number] | null;
  fixed: number[];
  comparisons: number;
  swaps: number;
  result?: number;
};

export const linearSearchCode = [
  "def linear_search(a, target):",
  "    for i, value in enumerate(a):",
  "        if value == target:",
  "            return i",
  "    return -1",
];

export const quickSortCode = [
  "def quick_sort(a, low=0, high=None):",
  "    if high is None: high = len(a) - 1",
  "    if low >= high: return",
  "    pivot = a[high]",
  "    i = low",
  "    for j in range(low, high):",
  "        if a[j] <= pivot:",
  "            a[i], a[j] = a[j], a[i]",
  "            i += 1",
  "    a[i], a[high] = a[high], a[i]",
  "    quick_sort(a, low, i - 1)",
  "    quick_sort(a, i + 1, high)",
  "    return a",
];

export function parseVisualArray(input: string, maximum = 12): number[] {
  const parts = input.split(",").map((part) => part.trim());
  if (parts.length > maximum || parts.some((part) => !/^-?\d+$/.test(part))) {
    throw new Error(`Enter 1-${maximum} whole numbers, separated by commas.`);
  }
  const values = parts.map(Number);
  if (
    values.some((value) => !Number.isSafeInteger(value) || Math.abs(value) > 99)
  ) {
    throw new Error("Use numbers between -99 and 99.");
  }
  return values;
}

export function parseVisualTarget(input: string): number {
  if (!/^-?\d+$/.test(input.trim()) || Math.abs(Number(input)) > 99) {
    throw new Error("Enter a whole-number target between -99 and 99.");
  }
  return Number(input);
}

export function linearSearchSteps(
  values: number[],
  target: number,
): VisualStep[] {
  const items = values.map((value, id) => ({ id, value }));
  const steps: VisualStep[] = [];
  let comparisons = 0;
  const add = (
    line: number,
    phase: string,
    title: string,
    explanation: string,
    active: number | null,
    result?: number,
  ) => {
    steps.push({
      items: [...items],
      line,
      phase,
      title,
      explanation,
      active,
      pivot: null,
      boundary: null,
      range: [0, items.length - 1],
      fixed: [],
      comparisons,
      swaps: 0,
      result,
    });
  };
  add(
    1,
    "Start",
    `Find ${target} in the array`,
    "Linear search checks positions from left to right. The array does not need to be sorted.",
    null,
  );
  for (let index = 0; index < items.length; index++) {
    add(
      2,
      "Visit",
      `Visit index ${index}`,
      `The value at index ${index} is ${items[index].value}. Check it against ${target}.`,
      index,
    );
    comparisons++;
    add(
      3,
      "Compare",
      `${items[index].value} ${items[index].value === target ? "=" : "does not equal"} ${target}`,
      items[index].value === target
        ? "This is the first match. Return its index."
        : "No match here. Continue to the next position.",
      index,
    );
    if (items[index].value === target) {
      add(
        4,
        "Found",
        `Return index ${index}`,
        `The first ${target} is at index ${index}. Search complete.`,
        index,
        index,
      );
      return steps;
    }
  }
  add(
    5,
    "Missing",
    `${target} is not in the array`,
    "Every position was checked. Return -1 to mean no match was found.",
    null,
    -1,
  );
  return steps;
}

export function quickSortSteps(values: number[]): VisualStep[] {
  const items = values.map((value, id) => ({ id, value }));
  const fixed = new Set<number>();
  const steps: VisualStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const add = (
    line: number,
    phase: string,
    title: string,
    explanation: string,
    active: number | null,
    pivot: number | null,
    boundary: number | null,
    range: [number, number] | null,
  ) => {
    steps.push({
      items: items.map((item) => ({ ...item })),
      line,
      phase,
      title,
      explanation,
      active,
      pivot,
      boundary,
      range,
      fixed: [...fixed],
      comparisons,
      swaps,
    });
  };
  add(
    1,
    "Start",
    "Partition, then sort each side",
    "Choose the last value as a pivot. Move values at or below it left, place the pivot, then repeat on each side.",
    null,
    null,
    null,
    [0, items.length - 1],
  );
  const partition = (low: number, high: number) => {
    if (low > high) return;
    if (low === high) {
      fixed.add(low);
      add(
        3,
        "Single value",
        `${items[low].value} is already in place`,
        "A one-value range needs no sorting.",
        low,
        null,
        null,
        [low, high],
      );
      return;
    }
    add(
      3,
      "Range",
      `Sort positions ${low} to ${high}`,
      "Only this range is being partitioned now. Other finished pivots stay in place.",
      null,
      null,
      null,
      [low, high],
    );
    const pivotValue = items[high].value;
    let boundary = low;
    add(
      4,
      "Choose pivot",
      `Pivot is ${pivotValue}`,
      `Compare each value in this range with ${pivotValue}. The pivot begins at index ${high}.`,
      null,
      high,
      boundary,
      [low, high],
    );
    add(
      5,
      "Set boundary",
      `Left side starts at index ${boundary}`,
      "The boundary marks where the next value at or below the pivot belongs.",
      null,
      high,
      boundary,
      [low, high],
    );
    for (let scan = low; scan < high; scan++) {
      add(
        6,
        "Scan",
        `Visit index ${scan}`,
        `Compare ${items[scan].value} with pivot ${pivotValue}.`,
        scan,
        high,
        boundary,
        [low, high],
      );
      comparisons++;
      const movesLeft = items[scan].value <= pivotValue;
      add(
        7,
        "Compare",
        `${items[scan].value} ${movesLeft ? "<=" : ">"} ${pivotValue}`,
        movesLeft
          ? "This value belongs on the left side of the pivot."
          : "Leave this value on the right side for now.",
        scan,
        high,
        boundary,
        [low, high],
      );
      if (movesLeft) {
        if (boundary !== scan) {
          [items[boundary], items[scan]] = [items[scan], items[boundary]];
          swaps++;
        }
        add(
          8,
          "Move left",
          boundary === scan
            ? `${items[boundary].value} stays at index ${boundary}`
            : `Move ${items[boundary].value} to index ${boundary}`,
          "The checked value is now on the left side of the boundary.",
          boundary,
          high,
          boundary,
          [low, high],
        );
        boundary++;
        add(
          9,
          "Advance boundary",
          `Next left position: ${boundary}`,
          "Move the boundary one position right.",
          scan,
          high,
          boundary,
          [low, high],
        );
      }
    }
    if (boundary !== high) {
      [items[boundary], items[high]] = [items[high], items[boundary]];
      swaps++;
    }
    fixed.add(boundary);
    add(
      10,
      "Place pivot",
      `Pivot ${pivotValue} is fixed at index ${boundary}`,
      "Every value to the left is at or below the pivot. Every value to the right is larger. The pivot will not move again.",
      boundary,
      boundary,
      boundary,
      [low, high],
    );
    if (low < boundary) {
      add(
        11,
        "Sort left",
        `Sort left side: ${low} to ${boundary - 1}`,
        "Apply the same partition rule to the values left of the pivot.",
        null,
        null,
        null,
        [low, boundary - 1],
      );
      partition(low, boundary - 1);
    }
    if (boundary < high) {
      add(
        12,
        "Sort right",
        `Sort right side: ${boundary + 1} to ${high}`,
        "Apply the same partition rule to the values right of the pivot.",
        null,
        null,
        null,
        [boundary + 1, high],
      );
      partition(boundary + 1, high);
    }
  };
  partition(0, items.length - 1);
  items.forEach((_, index) => fixed.add(index));
  add(
    13,
    "Complete",
    "The array is sorted",
    `Finished with ${comparisons} comparisons and ${swaps} exchanges.`,
    null,
    null,
    null,
    null,
  );
  return steps;
}
