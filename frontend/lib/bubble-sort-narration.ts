import type { BubbleStep } from "./bubble-sort";

export type BubbleNarrationPart = {
  text: string;
  pauseAfter: number;
  move?: boolean;
};

/** Short, spoken explanations; the movement cue stays attached to the swap sentence. */
export function bubbleSortNarration(step: BubbleStep): BubbleNarrationPart[] {
  const say = (
    text: string,
    pauseAfter = 500,
    move = false,
  ): BubbleNarrationPart => ({ text, pauseAfter, move });
  const count = step.items.length;
  const j = step.pair;
  switch (step.status) {
    case "ready":
      if (count < 2)
        return [
          say(
            count === 0
              ? "This list is empty. There are no numbers to sort."
              : "There's only one number, so there's nothing to compare. It's already sorted.",
          ),
        ];
      return [
        say("Let's put these numbers in order, from smallest to biggest."),
        say(
          "We'll look at two numbers next to each other. If the left number is bigger, we'll swap them. Swap just means change places.",
        ),
        say(
          "We'll start on the left and work our way to the right. The biggest number will end up at the end.",
        ),
      ];
    case "pass":
      if (step.pass === 1)
        return [
          say(
            "Start with the first two numbers. After each check, move one position right to check the next pair.",
          ),
          say("One trip across the numbers we're checking is called a pass."),
        ];
      if (step.sortedFrom === 2)
        return [
          say(
            "Just the first two numbers still need a final check. Let's check them.",
          ),
        ];
      return [
        say(
          `Start again from the left. Leave the numbers with a check mark alone. They're already in the right place.`,
        ),
      ];
    case "compare": {
      const left = step.items[j!].value,
        right = step.items[j! + 1].value;
      if (left > right)
        return [
          say(
            `${left} is bigger than ${right}. We want the smaller number first, so let's swap them.`,
            650,
          ),
        ];
      if (left === right)
        return [
          say(
            `Both numbers are ${left}. They're equal, so there's no need to swap them.`,
          ),
        ];
      return [
        say(
          `${left} is smaller than ${right}. They're already in the right order.`,
        ),
      ];
    }
    case "swap": {
      const smaller = step.items[j!].value,
        bigger = step.items[j! + 1].value;
      return [
        say(`${smaller} moves left, and ${bigger} moves right.`, 650, true),
        ...(j! + 1 === step.sortedFrom - 1
          ? [say(`${bigger} has reached the end of the part we're checking.`)]
          : step.swaps === 1
            ? [
                say(
                  "The bigger number moved one place to the right. We still need to check the rest of the list.",
                ),
              ]
            : []),
      ];
    }
    case "keep":
      return [
        say(
          j! + 1 === step.sortedFrom - 1
            ? "No swap needed. That's the last pair in this pass."
            : "No swap needed. Let's check the next pair.",
          400,
        ),
      ];
    case "settled": {
      if (step.passSwaps === 0)
        return [
          say("We finished this pass without making a single swap."),
          say(
            step.pass === 1
              ? "Every pair was already in order."
              : "The part we just checked is in order. The numbers with check marks were already finished.",
          ),
        ];
      const largest = step.items[step.sortedFrom].value;
      return [
        say(
          `${largest} is now in its final place. We won't need to check it again.`,
        ),
        ...(step.pass === 1
          ? [
              say(
                "Each time we checked a pair, the bigger number stayed on the right. That's how the biggest reached the end.",
              ),
            ]
          : []),
        say(
          step.sortedFrom === 1
            ? "Only one position is left. That number must be in the right place too."
            : step.sortedFrom === 2
              ? "Only the first two numbers still need a final check."
              : "The numbers before it may still be mixed up. Let's start another pass.",
        ),
      ];
    }
    case "done":
      if (count < 2) return [say("We're done. Return the list as it is.")];
      return [
        say(
          step.line === 9
            ? "A whole pass with no swaps tells us the list is sorted."
            : "The whole list is now in order, from smallest to biggest.",
        ),
        say(
          step.line === 9 && step.pass < count - 1
            ? "We can stop early. There's no need for another pass."
            : "Everything is in order, so we're done. Return the sorted list.",
        ),
        say(
          "That's bubble sort: check two numbers next to each other, swap if the left one is bigger, and keep going until the list is in order.",
        ),
      ];
  }
}
