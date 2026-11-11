export type SearchStep = {
  low: number;
  high: number;
  mid: number | null;
  line: number;
  comparisons: number;
  iteration: number;
  title: string;
  explanation: string;
  status: "ready" | "select" | "compare" | "narrow" | "found" | "missing";
};

/** Each snapshot is a complete teaching phase; rewinding never reconstructs state. */
export function binarySearchSteps(
  values: number[],
  target: number,
): SearchStep[] {
  let low = 0;
  let high = values.length - 1;
  let comparisons = 0;
  let iteration = 0;
  const steps: SearchStep[] = [
    {
      low,
      high,
      mid: null,
      line: 2,
      comparisons,
      iteration,
      status: "ready",
      title: `Find ${target} in a sorted array`,
      explanation:
        "The number inside a box is its value. The small number below is its position, called an index, starting at 0. Low and high show where to start and stop looking.",
    },
  ];
  while (low <= high) {
    iteration++;
    const mid = low + Math.floor((high - low) / 2);
    steps.push({
      low,
      high,
      mid,
      line: 4,
      comparisons,
      iteration,
      status: "select",
      title: `Choose mid index ${mid} · value ${values[mid]}`,
      explanation: `mid = ${low} + (${high} − ${low}) // 2 = ${low} + ${Math.floor((high - low) / 2)} = ${mid}. Subtract, halve and round down, then add low.`,
    });
    comparisons++;
    const equal = values[mid] === target;
    const right = values[mid] < target;
    steps.push({
      low,
      high,
      mid,
      line: equal ? 5 : right ? 7 : 9,
      comparisons,
      iteration,
      status: "compare",
      title: `${values[mid]} ${equal ? "=" : right ? "<" : ">"} ${target} → ${equal ? "match" : right ? "search right" : "search left"}`,
      explanation: equal
        ? "This is the number we wanted. We can stop and return its position."
        : right
          ? `${values[mid]} is too small. Everything to its left is too small too, so skip those numbers and mid. Look to the right.`
          : `${values[mid]} is too big. Everything to its right is too big too, so skip those numbers and mid. Look to the left.`,
    });
    if (equal) {
      steps.push({
        low,
        high,
        mid,
        line: 6,
        comparisons,
        iteration,
        status: "found",
        title: `Found ${target} · return index ${mid}`,
        explanation: `Return ${mid}, the position of the match, not the value ${target}. Search complete.`,
      });
      return steps;
    }
    if (right) low = mid + 1;
    else high = mid - 1;
    steps.push({
      low,
      high,
      mid,
      line: right ? 8 : 10,
      comparisons,
      iteration,
      status: "narrow",
      title: right
        ? `Move low: mid + 1 = ${low}`
        : `Move high: mid − 1 = ${high}`,
      explanation:
        low > high
          ? `low = ${low} > high = ${high}. The range is empty; next we return -1.`
          : `${high - low + 1} possible ${high === low ? "match remains" : "matches remain"}. We've already checked mid. Next, check the middle of the numbers that are left.`,
    });
  }
  steps.push({
    low,
    high,
    mid: null,
    line: 11,
    comparisons,
    iteration,
    status: "missing",
    title: `${target} not found · return -1`,
    explanation: `low = ${low} > high = ${high}. There's nowhere left to look. Stop and return -1 to mean not found.`,
  });
  return steps;
}

export function parseSearchInput(array: string, target: string) {
  const parts = array.split(",").map((part) => part.trim());
  if (parts.length > 20 || parts.some((part) => !/^-?\d+$/.test(part)))
    throw new Error("Enter 1–20 whole numbers separated by commas.");
  const values = parts.map(Number);
  if (
    values.some(
      (value) => !Number.isSafeInteger(value) || Math.abs(value) > 999,
    )
  )
    throw new Error("Keep each array value between -999 and 999.");
  if (values.some((value, index) => index > 0 && value < values[index - 1]))
    throw new Error(
      "Binary search needs a sorted array. Put the values in ascending order.",
    );
  if (
    !/^-?\d+$/.test(target.trim()) ||
    !Number.isSafeInteger(Number(target)) ||
    Math.abs(Number(target)) > 999
  )
    throw new Error("Enter a whole-number target between -999 and 999.");
  return { values, target: Number(target) };
}
