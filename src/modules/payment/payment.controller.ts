import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

const getActor = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

export const paymentController = {
  createPaymentIntent: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const result = await paymentService.createPaymentIntent(req.body, actor);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Payment intent created successfully",
      data: result,
    });
  }),

  confirmPayment: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const result = await paymentService.confirmPayment(req.body, actor);

    return sendResponse({
      res,
      message: "Payment confirmed successfully",
      data: result,
    });
  }),

  getPaymentHistory: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const history = await paymentService.getPaymentHistory(actor.userId);

    return sendResponse({
      res,
      message: "Payment history retrieved successfully",
      data: history,
    });
  }),

  getPaymentDetails: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const paymentId = getParamId(req.params.id, "Payment id is required");
    const payment = await paymentService.getPaymentDetails(paymentId, actor);

    return sendResponse({
      res,
      message: "Payment retrieved successfully",
      data: payment,
    });
  }),
};
