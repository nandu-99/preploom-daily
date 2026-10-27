import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import { createTopicSchema, updateTopicSchema } from "../src/routes/topics.js";

test("validates and normalizes topic input", () => {
  const topic = createTopicSchema.parse({
    title: " Process Scheduling ",
    slug: " Process-Scheduling ",
    content: "A process scheduler decides which process runs next.",
    position: 2,
  });

  assert.equal(topic.title, "Process Scheduling");
  assert.equal(topic.slug, "process-scheduling");
  assert.equal(topic.position, 2);
});

test("rejects empty updates and invalid topic content", () => {
  assert.equal(updateTopicSchema.safeParse({}).success, false);
  assert.equal(
    createTopicSchema.safeParse({
      title: "Scheduling",
      slug: "bad slug",
      content: "Too short",
    }).success,
    false,
  );
});

test("protects topic creation before accessing the database", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(
      `http://127.0.0.1:${port}/subjects/operating-systems/topics`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Process Scheduling",
          slug: "process-scheduling",
          content: "A process scheduler decides which process runs next.",
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
