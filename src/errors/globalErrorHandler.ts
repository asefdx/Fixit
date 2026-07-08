import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "./AppError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: Record<string, unknown> = {};

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errorDetails = error.flatten();
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorDetails = error.errorDetails;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = error.code === "P2002" ? 409 : 400;
    message =
      error.code === "P2002" ? "Duplicate resource" : "Database request failed";
    errorDetails = {
      code: error.code,
      meta: error.meta,
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database validation failed";
    errorDetails = {
      details: error.message,
    };
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = {
      details: error.stack,
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
