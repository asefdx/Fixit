import type { Request, RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

import { AppError } from "../errors/AppError";

type RequestSegment = "body" | "params" | "query";

const assignRequestSegment = (
  req: Request,
  segment: RequestSegment,
  value: unknown,
) => {
  Object.defineProperty(req, segment, {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  });
};

export const validateRequest = (
  schema: ZodTypeAny,
  segment: RequestSegment = "body",
): RequestHandler => {
  return async (req, _res, next) => {
    const result = await schema.safeParseAsync(req[segment]);

    if (!result.success) {
      return next(
        new AppError(400, "Validation error", result.error.flatten()),
      );
    }

    assignRequestSegment(req, segment, result.data);
    next();
  };
};
