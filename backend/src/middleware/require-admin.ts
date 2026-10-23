import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export const requireAdmin: RequestHandler = (request, _response, next) => {
  const authorization = request.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication is required.", 401, "UNAUTHORIZED"));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length).trim();
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (!isAdminToken(payload)) {
      throw new Error("Invalid token payload.");
    }

    request.adminAuth = {
      id: payload.sub,
      email: payload.email,
    };
    next();
  } catch {
    next(
      new AppError(
        "Authentication token is invalid or expired.",
        401,
        "INVALID_TOKEN",
      ),
    );
  }
};

function isAdminToken(payload: string | JwtPayload): payload is JwtPayload & {
  sub: string;
  email: string;
} {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    typeof payload.email === "string"
  );
}
