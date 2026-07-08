import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { usersService } from "./users.service";

export const usersController = {
  getUserById: catchAsync(async (req, res: Response) => {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!userId) {
      throw new AppError(400, "User id is required");
    }

    const user = await usersService.getUserById(userId);

    return sendResponse({
      res,
      message: "User retrieved successfully",
      data: user,
    });
  }),

  updateProfile: catchAsync(async (req, res: Response) => {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await usersService.updateProfile(user.userId, req.body);

    return sendResponse({
      res,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  }),

  changePassword: catchAsync(async (req, res: Response) => {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await usersService.changePassword(user.userId, req.body);

    return sendResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
};
