import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import { prisma } from "../src/config/database.js";

test(
  "scores quiz answers without exposing the answer key before submission",
  { skip: !process.env.TEST_DATABASE_URL },
  async () => {
    const subject = await prisma.subject.create({
      data: {
        name: "Quiz scoring test",
        slug: `quiz-score-${randomUUID().slice(0, 8)}`,
      },
    });
    const quiz = await prisma.quiz.create({
      data: {
        subjectId: subject.id,
        title: "Scoring test",
        slug: "scoring-test",
        questions: {
          create: [
            {
              prompt: "Which option is right?",
              options: ["First", "Second"],
              correctOption: 1,
              explanation: "The second option is right.",
              position: 0,
            },
            {
              prompt: "Which option is first?",
              options: ["One", "Two"],
              correctOption: 0,
              position: 1,
            },
          ],
        },
      },
      include: { questions: { orderBy: { position: "asc" } } },
    });
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const { port } = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/subjects/${subject.slug}/quizzes/${quiz.slug}`;

    try {
      const detail = await fetch(url);
      assert.equal(detail.status, 200);
      const detailBody = (await detail.json()) as {
        data: { quiz: { questions: Record<string, unknown>[] } };
      };
      assert.equal("correctOption" in detailBody.data.quiz.questions[0], false);

      const response = await fetch(`${url}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          answers: [
            { questionId: quiz.questions[0].id, optionIndex: 1 },
            { questionId: quiz.questions[1].id, optionIndex: 1 },
          ],
        }),
      });
      const body = (await response.json()) as {
        data: {
          score: number;
          total: number;
          results: { correct: boolean; explanation: string | null }[];
        };
      };
      assert.equal(response.status, 200);
      assert.equal(body.data.score, 1);
      assert.equal(body.data.total, 2);
      assert.deepEqual(
        body.data.results.map((result) => result.correct),
        [true, false],
      );
      assert.equal(
        body.data.results[0].explanation,
        "The second option is right.",
      );

      const invalid = await fetch(`${url}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          answers: [{ questionId: quiz.questions[0].id, optionIndex: 0 }],
        }),
      });
      assert.equal(invalid.status, 400);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      await prisma.quiz.delete({ where: { id: quiz.id } });
      await prisma.subject.delete({ where: { id: subject.id } });
    }
  },
);
