import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    try {
      if (schemas.body) request.body = schemas.body.parse(request.body);
      if (schemas.params) {
        request.params = schemas.params.parse(
          request.params,
        ) as typeof request.params;
      }
      if (schemas.query) {
        const query = schemas.query.parse(request.query) as Record<
          string,
          unknown
        >;
        Object.assign(request.query, query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
