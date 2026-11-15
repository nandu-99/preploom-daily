import type { InsertionStep } from "./insertion-sort";
export type InsertionNarrationPart = {
  text: string;
  pauseAfter: number;
  move?: boolean;
};
export function insertionSortNarration(
  step: InsertionStep,
): InsertionNarrationPart[] {
  const say = (text: string, move = false): InsertionNarrationPart => ({
    text,
    pauseAfter: 500,
    move,
  });
  if (step.status === "ready")
    return step.items.length < 2
      ? [say(step.explanation)]
      : [
          say("Let's put these numbers in order, from smallest to biggest."),
          say(step.explanation),
          say(
            "Think of arranging cards in your hand. Take one card, make room for it, and put it where it belongs.",
          ),
        ];
  if (step.status === "pick")
    return [
      say(`Lift ${step.held!.value} out and keep it aside.`, true),
      say(
        step.i === 1
          ? "We have not removed it for good. We are just holding it while we make room. Look at the number to the left of the empty space."
          : "Let's make room for it in the sorted part.",
      ),
    ];
  if (step.status === "shift") return [say(step.explanation, true)];
  if (step.status === "insert")
    return [say(step.title + ".", true), say(step.explanation)];
  if (step.status === "done")
    return [
      say(step.explanation),
      ...(step.items.length > 1
        ? [
            say(
              "That's insertion sort: take the next number, move bigger numbers right, and put it in the gap.",
            ),
          ]
        : []),
    ];
  return [say(step.explanation)];
}
