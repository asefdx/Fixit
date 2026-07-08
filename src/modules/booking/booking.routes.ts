import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { bookingController } from "./booking.controller";
import { bookingActionSchema, createBookingSchema } from "./booking.validation";

const router = Router();

router.get("/", authenticate, bookingController.getMyBookings);

router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(createBookingSchema),
  bookingController.createBooking,
);

router.get(
  "/my",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  bookingController.getCustomerBookings,
);

router.get(
  "/technician",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  bookingController.getTechnicianBookings,
);

router.get("/:id", authenticate, bookingController.getBookingDetails);

router.patch(
  "/:id/accept",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  bookingController.acceptBooking,
);

router.patch(
  "/:id/decline",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(bookingActionSchema),
  bookingController.declineBooking,
);

router.patch(
  "/:id/start",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  bookingController.startWork,
);

router.patch(
  "/:id/complete",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  bookingController.completeWork,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(bookingActionSchema),
  bookingController.cancelBooking,
);

export default router;
