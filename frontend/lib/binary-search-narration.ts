import type { SearchStep } from "./binary-search";

export type NarrationPart = {
  text: string;
  pauseAfter: number;
  move?: boolean;
};

/** Teach fully once, then let the learner practice with shorter prompts. */
export function binarySearchNarration(
  step: SearchStep,
  values: number[],
  target: number,
): NarrationPart[] {
  const say = (
    text: string,
    pauseAfter = 500,
    move = false,
  ): NarrationPart => ({ text, pauseAfter, move });
  const value = step.mid === null ? null : values[step.mid];
  switch (step.status) {
    case "ready":
      return [
        say(
          `Let's find ${target} in this list. The small number under each box tells us its position. We call that an index, and we start counting from zero.`,
        ),
        say(
          `Low means where we start looking. High means where we stop looking. For now, we're looking at the whole list.`,
        ),
        say(
          "These numbers go from smallest to largest. So, instead of checking them one by one, we can check the middle and skip a whole side.",
        ),
      ];
    case "select": {
      if (step.low === step.high)
        return [
          say(
            `There's just one number left to check: ${value}, at index ${step.low}. Low and high are in the same place. Let's see if this is ${target}.`,
          ),
        ];
      if (step.iteration > 1)
        return [
          say(
            `Now we're only looking from index ${step.low} to ${step.high}. Let's check the middle again: index ${step.mid}, where the number is ${value}.`,
          ),
        ];
      const distance = step.high - step.low;
      const half = Math.floor(distance / 2);
      return [
        say(
          `Let's work out the middle position. We call it mid. Low is ${step.low}, and high is ${step.high}.`,
        ),
        say(
          `${step.high} minus ${step.low} is ${distance}. Divide that by two and we get ${distance / 2}.${distance % 2 ? ` We need a whole position, so round down to ${half}.` : ""}`,
          650,
        ),
        say(
          `Now start at low and move ${half} positions to the right. ${step.low} plus ${half} gives us index ${step.mid}.`,
        ),
        say(
          `The number in that box is ${value}. Is it smaller than ${target}, bigger, or the same?`,
        ),
      ];
    }
    case "compare": {
      if (value === target)
        return [say(`${value} equals ${target}. That's a match.`)];
      const right = value! < target;
      return [
        say(`${value} is ${right ? "smaller" : "larger"} than ${target}.`, 650),
        say(
          `The list is in order, so everything to the ${right ? "left is also too small" : "right is also too big"}. We can skip that side and this middle number. Let's look to the ${right ? "right" : "left"}.`,
        ),
      ];
    }
    case "narrow": {
      const right = value! < target;
      const remaining = Math.max(0, step.high - step.low + 1);
      return [
        say(
          `We've checked this middle number. It isn't the one we want, so we can skip it too.`,
          400,
        ),
        say(
          `Move ${right ? `low to index ${step.low}, one after mid` : `high to index ${step.high}, one before mid`}.`,
          650,
          true,
        ),
        say(
          remaining === 0
            ? "Low has moved past high. There's nowhere left to look."
            : remaining === 1
              ? "Just one number left. Let's check it next."
              : `Only ${remaining} numbers left to check. Let's do the same thing again.`,
        ),
      ];
    }
    case "found":
      return [
        say(
          `Return index ${step.mid}, not the value ${target}. We found the target in ${step.comparisons} ${step.comparisons === 1 ? "comparison" : "comparisons"}.`,
        ),
        say(
          "That's binary search: check the middle, skip the side that can't help, and do it again.",
        ),
      ];
    case "missing":
      return [
        say(
          `We've checked all the places ${target} could be. Low is now ${step.low}, past high at ${step.high}. There's nothing left to check.`,
        ),
        say(
          "Return minus one. That's how our code says not found. Remember: if low and high are equal, there's still one number to check. We stop when low goes past high.",
        ),
      ];
  }
}
