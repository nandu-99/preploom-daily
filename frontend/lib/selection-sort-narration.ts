import type { SelectionStep } from "./selection-sort";
export type SelectionNarrationPart = {
  text: string;
  pauseAfter: number;
  move?: boolean;
};
export function selectionSortNarration(
  step: SelectionStep,
): SelectionNarrationPart[] {
  const say = (
    text: string,
    pauseAfter = 500,
    move = false,
  ): SelectionNarrationPart => ({ text, pauseAfter, move });
  switch (step.status) {
    case "ready":
      return step.items.length < 2
        ? [say("With fewer than two numbers, there's nothing to sort.")]
        : [
            say("Let's put these numbers in order, from smallest to biggest."),
            say(
              "First, find the smallest number in the whole list and put it at the front. Then do the same with the numbers that are left.",
            ),
            say(
              "The small labels below the boxes are positions. They start at zero.",
            ),
          ];
    case "pass":
      return [
        say(
          step.pass === 1
            ? "Let's find the smallest number. For now, choose the first one."
            : `Now fill position ${step.start}. Leave the numbers with check marks alone.`,
        ),
        say(
          `${step.items[step.start].value} is our starting choice. We'll check the numbers to its right to see if there's anything smaller.`,
        ),
      ];
    case "compare":
      return [say(step.explanation, 650)];
    case "minimum":
      return [
        say(
          `${step.items[step.minIndex!].value} is smaller. Remember this position instead.`,
          650,
        ),
        ...(step.pass === 1
          ? [
              say(
                "We're only changing our choice. We won't swap until we've checked the rest.",
              ),
            ]
          : []),
      ];
    case "keep":
      return [say(step.explanation, 400)];
    case "decision":
      return [say(step.explanation)];
    case "swap":
      return [
        say(
          "We've checked all the numbers in this part. Now we can put the smallest in place.",
          450,
        ),
        say(
          `${step.items[step.start].value} moves to position ${step.start}, and ${step.items[step.minIndex!].value} moves to position ${step.minIndex}. They exchange places.`,
          650,
          true,
        ),
      ];
    case "settled":
      return [
        say(`${step.items[step.start].value} is now in its final place.`),
        say(
          step.sortedCount === step.items.length - 1
            ? "Only one number is left. It must be in the right place too."
            : "The numbers after it may still be mixed up. Let's find the smallest among those next.",
        ),
      ];
    case "done":
      return [
        say("We're done. Return the list in order, from smallest to biggest."),
        ...(step.items.length > 1
          ? [
              say(
                "That's selection sort: find the smallest in the part that's left, put it first, and repeat.",
              ),
            ]
          : []),
      ];
  }
}
