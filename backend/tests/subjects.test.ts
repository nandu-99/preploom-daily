import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../src/routes/subjects.js";

test("validates and normalizes subject input", () => {
  const subject = createSubjectSchema.parse({
    name: "Operating Systems",
    slug: " Operating-Systems ",
    description: "Learn processes, memory, and scheduling.",
  });

  assert.equal(subject.name, "Operating Systems");
  assert.equal(subject.slug, "operating-systems");
});

test("rejects invalid subject input", () => {
  assert.equal(
    createSubjectSchema.safeParse({ name: "O", slug: "not valid" }).success,
    false,
  );
  assert.equal(updateSubjectSchema.safeParse({}).success, false);
});

test("protects subject creation", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/subjects`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Operating Systems",
        slug: "operating-systems",
      }),
    });
    const body = (await response.json()) as { error: { code: string } };

    assert.equal(response.status, 401);
    assert.equal(body.error.code, "UNAUTHORIZED");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
