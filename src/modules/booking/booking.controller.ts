import type { Response } from "express";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

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

export const bookingController = {
  createBooking: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const booking = await bookingService.createBooking(actor.userId, req.body);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Booking created successfully",
      data: booking,
    });
  }),

  getCustomerBookings: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookings = await bookingService.listCustomerBookings(actor.userId);

    return sendResponse({
      res,
      message: "Customer bookings retrieved successfully",
      data: bookings,
    });
  }),

  getMyBookings: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookings = await bookingService.listBookingsByActor(actor);

    return sendResponse({
      res,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  }),

  getTechnicianBookings: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookings = await bookingService.listTechnicianBookings(actor.userId);

    return sendResponse({
      res,
      message: "Technician bookings retrieved successfully",
      data: bookings,
    });
  }),

  getBookingDetails: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.getBookingDetails(bookingId, actor);

    return sendResponse({
      res,
      message: "Booking retrieved successfully",
      data: booking,
    });
  }),

  acceptBooking: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.acceptBooking(bookingId, actor);

    return sendResponse({
      res,
      message: "Booking accepted successfully",
      data: booking,
    });
  }),

  declineBooking: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.declineBooking(
      bookingId,
      actor,
      req.body,
    );

    return sendResponse({
      res,
      message: "Booking declined successfully",
      data: booking,
    });
  }),

  startWork: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.startWork(bookingId, actor);

    return sendResponse({
      res,
      message: "Booking started successfully",
      data: booking,
    });
  }),

  completeWork: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.completeWork(bookingId, actor);

    return sendResponse({
      res,
      message: "Booking completed successfully",
      data: booking,
    });
  }),

  cancelBooking: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const bookingId = getParamId(req.params.id, "Booking id is required");
    const booking = await bookingService.cancelBooking(
      bookingId,
      actor,
      req.body,
    );

    return sendResponse({
      res,
      message: "Booking cancelled successfully",
      data: booking,
    });
  }),
};
