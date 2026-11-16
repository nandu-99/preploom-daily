import assert from "node:assert/strict";
import { test } from "node:test";
import {
  linearSearchCode,
  linearSearchSteps,
  parseVisualArray,
  parseVisualTarget,
  quickSortCode,
  quickSortSteps,
} from "../lib/extra-visualizations.ts";

function arraysOfLength(length) {
  if (length === 0) return [[]];
  return arraysOfLength(length - 1).flatMap((prefix) =>
    [-1, 0, 1].map((value) => [...prefix, value]),
  );
}

test("linear search returns the first match and tracks the executed code line", () => {
  for (let length = 1; length <= 5; length++) {
    for (const values of arraysOfLength(length)) {
      for (const target of [-2, -1, 0, 1, 2]) {
        const steps = linearSearchSteps(values, target);
        assert.equal(steps.at(-1).result, values.indexOf(target));
        assert.equal(steps.at(-1).line, values.includes(target) ? 4 : 5);
        assert.ok(
          steps.every(
            (step) => step.line >= 1 && step.line <= linearSearchCode.length,
          ),
        );
        assert.equal(
          steps.filter((step) => step.phase === "Compare").length,
          steps.at(-1).comparisons,
        );
      }
    }
  }
});

test("quick sort preserves values and identities while placing every pivot", () => {
  for (let length = 1; length <= 5; length++) {
    for (const values of arraysOfLength(length)) {
      const steps = quickSortSteps(values);
      assert.deepEqual(
        steps.at(-1).items.map((item) => item.value),
        [...values].sort((a, b) => a - b),
      );
      assert.deepEqual(
        [...steps.at(-1).fixed].sort((a, b) => a - b),
        values.map((_, index) => index),
      );
      for (const step of steps) {
        assert.ok(step.line >= 1 && step.line <= quickSortCode.length);
        assert.deepEqual(
          step.items.map((item) => item.id).sort((a, b) => a - b),
          values.map((_, index) => index),
        );
      }
      assert.equal(
        steps.filter((step) => step.phase === "Compare").length,
        steps.at(-1).comparisons,
      );
    }
  }
});

test("custom inputs reject invalid or oversized values", () => {
  assert.deepEqual(parseVisualArray("3, -2, 3"), [3, -2, 3]);
  assert.equal(parseVisualTarget("-2"), -2);
  assert.throws(() => parseVisualArray("3, x"));
  assert.throws(() => parseVisualArray("100"));
  assert.throws(() => parseVisualArray("1,2,3", 2));
  assert.throws(() => parseVisualTarget("2.5"));
});
