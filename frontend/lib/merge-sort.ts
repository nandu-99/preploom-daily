export type MergeItem = { id: number; value: number };
export type MergeStep = {
  status:
    | "ready"
    | "split"
    | "single"
    | "merge"
    | "compare"
    | "rest"
    | "take"
    | "merged"
    | "done";
  trail: { group: number[]; side: string; sibling: number[]; ready: boolean }[];
  group: MergeItem[];
  left: MergeItem[];
  right: MergeItem[];
  output: MergeItem[];
  l: number;
  r: number;
  start: number;
  depth: number;
  comparisons: number;
  placements: number;
  line: number;
  title: string;
  explanation: string;
};
export const mergeSortCode = [
  "def merge_sort(a):",
  "    if len(a) <= 1:",
  "        return a",
  "    mid = len(a) // 2",
  "    left = merge_sort(a[:mid])",
  "    right = merge_sort(a[mid:])",
  "    result = []",
  "    i = j = 0",
  "    while i < len(left) and j < len(right):",
  "        if left[i] <= right[j]:",
  "            result.append(left[i])",
  "            i += 1",
  "        else:",
  "            result.append(right[j])",
  "            j += 1",
  "    result.extend(left[i:])",
  "    result.extend(right[j:])",
  "    return result",
];
export function mergeSortSteps(values: number[]): MergeStep[] {
  const original = values.map((value, id) => ({ value, id }));
  const steps: MergeStep[] = [];
  let comparisons = 0,
    placements = 0;
  const push = (state: Omit<MergeStep, "comparisons" | "placements">) =>
    steps.push({
      ...state,
      group: state.group.map((x) => ({ ...x })),
      left: state.left.map((x) => ({ ...x })),
      right: state.right.map((x) => ({ ...x })),
      output: state.output.map((x) => ({ ...x })),
      comparisons,
      placements,
    });
  const initial = {
    group: original,
    left: [],
    right: [],
    output: [],
    l: 0,
    r: 0,
    start: 0,
    depth: 0,
    trail: [],
  };
  push({
    ...initial,
    status: "ready",
    line: 1,
    title: "Let’s put these numbers in order",
    explanation:
      values.length < 2
        ? "This list is already sorted. There is nothing to compare."
        : "A small list is easier to sort than a big one. Break this list into smaller groups. Then put the groups back together, taking the smaller number each time.",
  });
  function sort(
    group: MergeItem[],
    start: number,
    depth: number,
    trail: MergeStep["trail"] = [],
  ): MergeItem[] {
    const state = {
      group,
      left: [] as MergeItem[],
      right: [] as MergeItem[],
      output: [] as MergeItem[],
      l: 0,
      r: 0,
      start,
      depth,
      trail,
    };
    if (group.length <= 1) {
      push({
        ...state,
        status: "single",
        line: 3,
        title: group.length
          ? `${group[0].value} is on its own`
          : "The list is empty",
        explanation:
          depth === 0
            ? "There is nothing to rearrange. This is the whole list, so we are done."
            : `There is only ${group[0]?.value} here. Nothing to sort! We can use it when we join the groups back together.`,
      });
      return group;
    }
    const mid = Math.floor(group.length / 2);
    push({
      ...state,
      left: group.slice(0, mid),
      right: group.slice(mid),
      status: "split",
      line: 4,
      title: "Split this group into two",
      explanation: `Make two smaller groups: ${group
        .slice(0, mid)
        .map((x) => x.value)
        .join(", ")} on the left, and ${group
        .slice(mid)
        .map((x) => x.value)
        .join(", ")} on the right. The numbers stay in the same order for now.`,
    });
    state.left = sort(group.slice(0, mid), start, depth + 1, [
      ...trail,
      {
        group: group.map((x) => x.value),
        side: "Left",
        sibling: group.slice(mid).map((x) => x.value),
        ready: false,
      },
    ]);
    state.right = sort(group.slice(mid), start + mid, depth + 1, [
      ...trail,
      {
        group: group.map((x) => x.value),
        side: "Right",
        sibling: state.left.map((x) => x.value),
        ready: true,
      },
    ]);
    push({
      ...state,
      status: "merge",
      line: 7,
      title: "Let’s make one list from these two",
      explanation: `Look at ${state.left[0].value} on the left and ${state.right[0].value} on the right. Each group is already in order. That means the smallest number in each group is at the front. Take the smaller of these two first.`,
    });
    while (state.l < state.left.length && state.r < state.right.length) {
      const a = state.left[state.l],
        b = state.right[state.r];
      const takeLeft = !!a && (!b || a.value <= b.value);
      if (a && b) {
        comparisons++;
        push({
          ...state,
          status: "compare",
          line: 10,
          title: `Look at ${a.value} and ${b.value}`,
          explanation:
            a.value === b.value
              ? `Both are ${a.value}. Take the left one first, so equal numbers keep their original order.`
              : `${takeLeft ? a.value : b.value} is smaller, so put it ${state.output.length === 0 ? "first" : "next"} in the new list.`,
        });
      }
      const chosen = takeLeft ? a : b;
      state.output.push(chosen);
      if (takeLeft) state.l++;
      else state.r++;
      placements++;
      push({
        ...state,
        status: "take",
        line: !a ? 17 : !b ? 16 : takeLeft ? 11 : 14,
        title: `Put ${chosen.value} in the next empty space`,
        explanation:
          !a || !b
            ? `The ${!a ? "left" : "right"} group is empty. Move ${chosen.value} from the other group. Its remaining numbers are already in order; no more comparisons are needed.`
            : `${state.output.map((x) => x.value).join(", ")} - this is our new list so far. Now look at the next number left in each group.`,
      });
    }
    const remaining = [
      ...state.left.slice(state.l),
      ...state.right.slice(state.r),
    ];
    if (remaining.length) {
      const emptyLeft = state.l === state.left.length;
      state.output.push(...remaining);
      placements += remaining.length;
      state.l = state.left.length;
      state.r = state.right.length;
      push({
        ...state,
        status: "rest",
        line: emptyLeft ? 17 : 16,
        title: `Bring up the rest from the ${emptyLeft ? "right" : "left"}`,
        explanation: `The ${emptyLeft ? "left" : "right"} group is empty. Bring up ${remaining.map((x) => x.value).join(", ")} from the other group. They are already in order, so no more comparisons are needed.`,
      });
    }
    push({
      ...state,
      status: "merged",
      line: 18,
      title: depth === 0 ? "The whole list is sorted" : "This group is ready",
      explanation: `${state.output.map((x) => x.value).join(", ")} - these numbers are in order. ${depth === 0 ? "This is the whole list. We are done." : "We have sorted this small group. Next, join it with another group to make a bigger sorted list."}`,
    });
    return state.output;
  }
  const output = sort(original, 0, 0);
  push({
    ...initial,
    group: output,
    output,
    status: "done",
    line: values.length <= 1 ? 3 : 18,
    title: "The whole list is sorted",
    explanation:
      values.length <= 1
        ? "Return the list as it is. No splitting or comparisons were needed."
        : `We split the list into smaller groups, then joined them in order. Return the sorted list. We used ${comparisons} comparisons.`,
  });
  // Teaching view: reveal the complete split tree before replaying joins in
  // their original left-first postorder. Splitting performs no comparisons.
  const setup = steps
    .filter((s) => s.status === "split" || s.status === "single")
    .map((s) => ({ ...s, comparisons: 0, placements: 0 }));
  const joins = steps.filter(
    (s) => !["ready", "split", "single"].includes(s.status),
  );
  return [steps[0], ...setup, ...joins];
}
export function parseMergeInput(input: string): number[] {
  const parts = input.split(",").map((x) => x.trim());
  if (parts.length > 12 || parts.some((x) => !/^-?\d+$/.test(x)))
    throw new Error("Enter 1-12 whole numbers, separated by commas.");
  const values = parts.map(Number);
  if (values.some((x) => !Number.isSafeInteger(x) || Math.abs(x) > 99))
    throw new Error("Use numbers between -99 and 99.");
  return values;
}
