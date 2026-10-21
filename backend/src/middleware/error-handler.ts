import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

type JsonSyntaxError = SyntaxError & {
  status?: number;
  body?: unknown;
};

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new AppError(
      `Route ${request.method} ${request.originalUrl} not found.`,
      404,
      "NOT_FOUND",
    ),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.issues,
      },
    });
    return;
  }

  if (isJsonSyntaxError(error)) {
    response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON.",
      },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};

function isJsonSyntaxError(error: unknown): error is JsonSyntaxError {
  return (
    error instanceof SyntaxError &&
    (error as JsonSyntaxError).status === 400 &&
    "body" in error
  );
}
