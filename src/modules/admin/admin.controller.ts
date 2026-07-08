import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import type {
  AdminBookingQueryInput,
  AdminUserQueryInput,
} from "./admin.validation";

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

export const adminController = {
  listUsers: catchAsync(async (req, res: Response) => {
    const query = req.query as unknown as AdminUserQueryInput;
    const result = await adminService.listUsers(query);

    return sendResponse({
      res,
      message: "Users retrieved successfully",
      data: result,
    });
  }),

  banUser: catchAsync(async (req, res: Response) => {
    const userId = getParamId(req.params.id, "User id is required");
    const user = await adminService.banUser(userId);

    return sendResponse({
      res,
      message: "User banned successfully",
      data: user,
    });
  }),

  unbanUser: catchAsync(async (req, res: Response) => {
    const userId = getParamId(req.params.id, "User id is required");
    const user = await adminService.unbanUser(userId);

    return sendResponse({
      res,
      message: "User unbanned successfully",
      data: user,
    });
  }),

  listBookings: catchAsync(async (req, res: Response) => {
    const query = req.query as unknown as AdminBookingQueryInput;
    const result = await adminService.listBookings(query);

    return sendResponse({
      res,
      message: "Bookings retrieved successfully",
      data: result,
    });
  }),

  getBookingById: catchAsync(async (req, res: Response) => {
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await adminService.getBookingById(bookingId);

    return sendResponse({
      res,
      message: "Booking retrieved successfully",
      data: booking,
    });
  }),
};
