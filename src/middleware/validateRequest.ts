import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

import { AppError } from "../errors/AppError";

type RequestSegment = "body" | "params" | "query";

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

    (req as unknown as Record<RequestSegment, unknown>)[segment] = result.data;
    next();
  };
};
