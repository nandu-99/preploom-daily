import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import {
  createQuestionSchema,
  updateQuestionSchema,
} from "../src/routes/questions.js";

test("normalizes question input", () => {
  const question = createQuestionSchema.parse({
    prompt: " What is process scheduling? ",
    slug: " Process-Scheduling ",
    answer: "It decides which process runs on the CPU next.",
    position: 2,
  });

  assert.equal(question.prompt, "What is process scheduling?");
  assert.equal(question.slug, "process-scheduling");
  assert.equal(question.position, 2);
});

test("rejects empty updates and incomplete questions", () => {
  assert.equal(updateQuestionSchema.safeParse({}).success, false);
  assert.equal(
    createQuestionSchema.safeParse({
      prompt: "Short?",
      slug: "bad slug",
      answer: "Too short",
    }).success,
    false,
  );
});

test("protects question creation before accessing the database", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(
      `http://127.0.0.1:${port}/subjects/operating-systems/questions`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: "What is process scheduling?",
          slug: "process-scheduling",
          answer: "It decides which process runs on the CPU next.",
        }),
      },
    );
    const body = (await response.json()) as { error: { code: string } };

    assert.equal(response.status, 401);
    assert.equal(body.error.code, "UNAUTHORIZED");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
