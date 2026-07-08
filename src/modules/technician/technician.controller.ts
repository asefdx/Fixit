import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import type { TechnicianListQueryInput } from "./technician.validation";

const extractUserId = (req: AuthenticatedRequest) => {
  const user = req.user;

  if (!user) {
    throw new AppError(401, "Unauthorized");
  }

  return user.userId;
};

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

export const technicianController = {
  listTechnicians: catchAsync(async (req, res: Response) => {
    const query = req.query as unknown as TechnicianListQueryInput;
    const result = await technicianService.listTechnicians(query);

    return sendResponse({
      res,
      message: "Technicians retrieved successfully",
      data: result,
    });
  }),

  getTechnicianProfile: catchAsync(async (req, res: Response) => {
    const technicianId = getParamId(req.params.id, "Technician id is required");
    const technician =
      await technicianService.getTechnicianProfile(technicianId);

    return sendResponse({
      res,
      message: "Technician profile retrieved successfully",
      data: technician,
    });
  }),

  updateProfile: catchAsync(async (req, res: Response) => {
    const userId = extractUserId(req as AuthenticatedRequest);
    const profile = await technicianService.upsertProfile(userId, req.body);

    return sendResponse({
      res,
      message: "Technician profile updated successfully",
      data: profile,
    });
  }),

  getAvailability: catchAsync(async (req, res: Response) => {
    const userId = extractUserId(req as AuthenticatedRequest);
    const availability = await technicianService.listAvailability(userId);

    return sendResponse({
      res,
      message: "Availability retrieved successfully",
      data: availability,
    });
  }),

  createAvailability: catchAsync(async (req, res: Response) => {
    const userId = extractUserId(req as AuthenticatedRequest);
    const availability = await technicianService.createAvailability(
      userId,
      req.body,
    );

    return sendResponse({
      res,
      statusCode: 201,
      message: "Availability slot created successfully",
      data: availability,
    });
  }),

  updateAvailability: catchAsync(async (req, res: Response) => {
    const userId = extractUserId(req as AuthenticatedRequest);
    const availabilityId = getParamId(
      req.params.id,
      "Availability id is required",
    );
    const availability = await technicianService.updateAvailability(
      userId,
      availabilityId,
      req.body,
    );

    return sendResponse({
      res,
      message: "Availability slot updated successfully",
      data: availability,
    });
  }),

  deleteAvailability: catchAsync(async (req, res: Response) => {
    const userId = extractUserId(req as AuthenticatedRequest);
    const availabilityId = getParamId(
      req.params.id,
      "Availability id is required",
    );
    const result = await technicianService.deleteAvailability(
      userId,
      availabilityId,
    );

    return sendResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
};
