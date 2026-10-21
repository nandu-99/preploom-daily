import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import { z } from "zod";
import { app } from "../src/app.js";
import { AppError } from "../src/errors/app-error.js";
import { errorHandler } from "../src/middleware/error-handler.js";
import { validateRequest } from "../src/middleware/validate-request.js";

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

async function withServer(
  application: ReturnType<typeof express>,
  run: (baseUrl: string) => Promise<void>,
) {
  const server = application.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("returns a consistent response for unknown routes", async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/missing`);
    const body = (await response.json()) as ErrorResponse;

    assert.equal(response.status, 404);
    assert.deepEqual(body, {
      error: {
        code: "NOT_FOUND",
        message: "Route GET /missing not found.",
      },
    });
  });
});

test("returns a safe response for invalid JSON", async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{invalid",
    });
    const body = (await response.json()) as ErrorResponse;

    assert.equal(response.status, 400);
    assert.equal(body.error.code, "INVALID_JSON");
  });
});

test("handles application and validation errors", async () => {
  const testApp = express();
  testApp.use(express.json());
  testApp.post(
    "/validate",
    validateRequest({ body: z.object({ name: z.string().min(2) }) }),
    (_request, response) => response.status(204).end(),
  );
  testApp.get("/forbidden", () => {
    throw new AppError("Admin access is required.", 403, "FORBIDDEN");
  });
  testApp.use(errorHandler);

  await withServer(testApp, async (baseUrl) => {
    const validationResponse = await fetch(`${baseUrl}/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "" }),
    });
    const validationBody = (await validationResponse.json()) as ErrorResponse;
    assert.equal(validationResponse.status, 400);
    assert.equal(validationBody.error.code, "VALIDATION_ERROR");

    const forbiddenResponse = await fetch(`${baseUrl}/forbidden`);
    const forbiddenBody = (await forbiddenResponse.json()) as ErrorResponse;
    assert.equal(forbiddenResponse.status, 403);
    assert.equal(forbiddenBody.error.code, "FORBIDDEN");
  });
});
