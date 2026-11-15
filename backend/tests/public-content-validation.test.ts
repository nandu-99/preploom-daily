import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { validatePublicContent } from "../src/routes/validate-public-content.js";

function seedFile(name: string) {
  return JSON.parse(readFileSync(new URL(`../prisma/${name}.json`, import.meta.url), "utf8"));
}

test("all seeded public content is accepted for editing", () => {
  const records: [string, string, unknown][] = [
    ...seedFile("subject-content").map((item: { slug: string }) => ["course", item.slug, item]),
    ...seedFile("interview-questions").map((item: { slug: string; questions: unknown }) => ["interview-questions", item.slug, item.questions]),
    ...seedFile("dsa-sheets").map((item: { id: string }) => ["dsa-sheet", item.id, item]),
    ...seedFile("roadmaps").map((item: { id: string }) => ["public-roadmap", item.id, item]),
    ...seedFile("quiz-definitions").map((item: { slug: string }) => ["quiz", item.slug, item]),
    ["webdev", "main", seedFile("webdev")],
    ["catalog", "subjects", seedFile("subject-catalog")],
  ];
  for (const [kind, id, value] of records) {
    assert.equal(validatePublicContent(kind, id, value), null, `${kind}:${id}`);
  }
});

test("an invalid quiz answer and duplicate item IDs are rejected", () => {
  const quiz = structuredClone(seedFile("quiz-definitions")[0]);
  quiz.questions[0].correctOptionId = "missing";
  assert.match(validatePublicContent("quiz", quiz.slug, quiz) ?? "", /correct option/);

  const catalog = structuredClone(seedFile("subject-catalog"));
  catalog[1].slug = catalog[0].slug;
  assert.match(validatePublicContent("catalog", "subjects", catalog) ?? "", /unique/);
});
