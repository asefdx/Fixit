import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { paymentController } from "./payment.controller";
import {
  confirmPaymentSchema,
  createPaymentIntentSchema,
} from "./payment.validation";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(createPaymentIntentSchema),
  paymentController.createPaymentIntent,
);

router.post(
  "/intent",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(createPaymentIntentSchema),
  paymentController.createPaymentIntent,
);

router.post(
  "/confirm",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(confirmPaymentSchema),
  paymentController.confirmPayment,
);

router.get(
  "/",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  paymentController.getPaymentHistory,
);

router.get(
  "/history",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  paymentController.getPaymentHistory,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER, UserRole.ADMIN),
  paymentController.getPaymentDetails,
);

export default router;
