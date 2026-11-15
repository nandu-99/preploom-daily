import type { MergeStep } from "./merge-sort";
export function mergeSortNarration(
  step: MergeStep,
): { text: string; pauseAfter: number; move?: boolean }[] {
  const say = (text: string, move = false) => ({ text, pauseAfter: 550, move });
  if (step.status === "ready" && step.group.length > 1)
    return [
      say("Let's put these numbers in order, from smallest to biggest."),
      say(step.explanation),
      say(
        "We do not need to sort one number on its own. That gives us an easy place to start.",
      ),
    ];
  if (step.status === "compare")
    return [say(step.title + ". " + step.explanation)];
  if (step.status === "rest") return [say(step.explanation, true)];
  if (step.status === "take") return [say(step.title + ".", true)];
  if (step.status === "split") return [say(step.explanation, true)];
  return [say(step.explanation)];
}
