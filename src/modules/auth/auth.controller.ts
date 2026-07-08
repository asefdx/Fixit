import type { Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { authService } from "./auth.service";

export const authController = {
  register: catchAsync(async (req, res: Response) => {
    const result = await authService.register(req.body);

    return sendResponse({
      res,
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  }),

  login: catchAsync(async (req, res: Response) => {
    const result = await authService.login(req.body);

    return sendResponse({
      res,
      message: "Login successful",
      data: result,
    });
  }),

  me: catchAsync(async (req, res: Response) => {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const currentUser = await authService.currentUser(user.userId);

    return sendResponse({
      res,
      message: "Current user retrieved successfully",
      data: currentUser,
    });
  }),
};
