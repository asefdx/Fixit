export class AppError extends Error {
  statusCode: number;
  errorDetails: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    errorDetails: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    Error.captureStackTrace(this, this.constructor);
  }
}
