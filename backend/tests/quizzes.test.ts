import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import { createQuizSchema, updateQuizSchema } from "../src/routes/quizzes.js";

const validQuiz = {
  title: "Operating Systems Basics",
  slug: "operating-systems-basics",
  questions: [
    {
      prompt: "What does a process contain?",
      options: ["A program in execution", "A file on disk"],
      correctOption: 0,
    },
  ],
};

test("accepts ordered quiz questions and valid answer indexes", () => {
  const quiz = createQuizSchema.parse(validQuiz);
  assert.equal(quiz.questions[0]?.correctOption, 0);
  assert.deepEqual(quiz.questions[0]?.options, [
    "A program in execution",
    "A file on disk",
  ]);
});

test("rejects missing questions, invalid answer indexes, and empty updates", () => {
  assert.equal(
    createQuizSchema.safeParse({ ...validQuiz, questions: [] }).success,
    false,
  );
  assert.equal(
    createQuizSchema.safeParse({
      ...validQuiz,
      questions: [{ ...validQuiz.questions[0], correctOption: 2 }],
    }).success,
    false,
  );
  assert.equal(updateQuizSchema.safeParse({}).success, false);
});

test("requires admin access for quiz writes and answer keys", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}/subjects/operating-systems/quizzes`;

  try {
    const createResponse = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validQuiz),
    });
    const answerResponse = await fetch(
      `${baseUrl}/operating-systems-basics/answer-key`,
    );

    assert.equal(createResponse.status, 401);
    assert.equal(answerResponse.status, 401);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
