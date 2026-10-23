import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";
import { errorHandler } from "../src/middleware/error-handler.js";
import { requireAdmin } from "../src/middleware/require-admin.js";

type ErrorResponse = {
  error: {
    code: string;
  };
};

async function createTestServer() {
  const application = express();
  application.get("/protected", requireAdmin, (request, response) => {
    response.status(200).json({ data: request.adminAuth });
  });
  application.use(errorHandler);

  const server = application.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}/protected`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

test("requires an admin token", async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(server.url);
    const body = (await response.json()) as ErrorResponse;

    assert.equal(response.status, 401);
    assert.equal(body.error.code, "UNAUTHORIZED");
  } finally {
    await server.close();
  }
});

test("rejects an invalid admin token", async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(server.url, {
      headers: { authorization: "Bearer invalid-token" },
    });
    const body = (await response.json()) as ErrorResponse;

    assert.equal(response.status, 401);
    assert.equal(body.error.code, "INVALID_TOKEN");
  } finally {
    await server.close();
  }
});

test("accepts a valid admin token", async () => {
  const server = await createTestServer();
  const token = jwt.sign({ email: "admin@preploom.com" }, env.JWT_SECRET, {
    subject: "admin-1",
    expiresIn: 60,
  });

  try {
    const response = await fetch(server.url, {
      headers: { authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as {
      data: { id: string; email: string };
    };

    assert.equal(response.status, 200);
    assert.equal(body.data.id, "admin-1");
    assert.equal(body.data.email, "admin@preploom.com");
  } finally {
    await server.close();
  }
});
