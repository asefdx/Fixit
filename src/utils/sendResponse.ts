import type { Response } from "express";

type SendResponseOptions<T> = {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
};

export const sendResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
}: SendResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? {},
  });
};
