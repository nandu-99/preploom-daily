import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { app } from "../src/app.js";
import {
  createRoadmapSchema,
  updateRoadmapSchema,
} from "../src/routes/roadmaps.js";

test("keeps roadmap steps in the submitted order", () => {
  const roadmap = createRoadmapSchema.parse({
    title: " Operating Systems Path ",
    slug: " Operating-Systems-Path ",
    steps: [
      { title: "Processes", description: "Learn how processes are managed." },
      { title: "Memory", description: "Study memory allocation and paging." },
    ],
  });

  assert.equal(roadmap.title, "Operating Systems Path");
  assert.equal(roadmap.slug, "operating-systems-path");
  assert.deepEqual(
    roadmap.steps.map((step) => step.title),
    ["Processes", "Memory"],
  );
});

test("rejects empty updates and roadmaps without complete steps", () => {
  assert.equal(updateRoadmapSchema.safeParse({}).success, false);
  assert.equal(
    createRoadmapSchema.safeParse({
      title: "Operating Systems Path",
      slug: "operating-systems-path",
      steps: [],
    }).success,
    false,
  );
  assert.equal(
    updateRoadmapSchema.safeParse({
      steps: [{ title: "Processes", description: "Too short" }],
    }).success,
    false,
  );
});

test("protects roadmap creation before accessing the database", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(
      `http://127.0.0.1:${port}/subjects/operating-systems/roadmaps`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Operating Systems Path",
          slug: "operating-systems-path",
          steps: [
            {
              title: "Processes",
              description: "Learn how processes are managed.",
            },
          ],
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
