import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import type { ReviewListQueryInput } from "./review.validation";

const getActor = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

export const reviewController = {
  createReview: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const review = await reviewService.createReview(req.body, actor);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Review created successfully",
      data: review,
    });
  }),

  listReviewsByService: catchAsync(async (req, res: Response) => {
    const serviceId = getParamId(
      req.params.serviceId,
      "Service id is required",
    );
    const query = req.query as unknown as ReviewListQueryInput;
    const result = await reviewService.listReviewsByService(serviceId, query);

    return sendResponse({
      res,
      message: "Service reviews retrieved successfully",
      data: result,
    });
  }),

  listReviewsByTechnician: catchAsync(async (req, res: Response) => {
    const technicianId = getParamId(
      req.params.technicianId,
      "Technician id is required",
    );
    const query = req.query as unknown as ReviewListQueryInput;
    const result = await reviewService.listReviewsByTechnician(
      technicianId,
      query,
    );

    return sendResponse({
      res,
      message: "Technician reviews retrieved successfully",
      data: result,
    });
  }),
};
