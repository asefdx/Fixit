import { Router } from "express";

import { UserRole } from "@prisma/client";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import {
  adminBookingQuerySchema,
  adminUserQuerySchema,
} from "./admin.validation";
import adminCategoryRoutes from "./admin.category.routes";

const router = Router();

router.use(authenticate, authorizeRoles(UserRole.ADMIN));

router.get(
  "/users",
  validateRequest(adminUserQuerySchema, "query"),
  adminController.listUsers,
);
router.patch("/users/:id", adminController.banUser);
router.patch("/users/:id/ban", adminController.banUser);
router.patch("/users/:id/unban", adminController.unbanUser);

router.get(
  "/bookings",
  validateRequest(adminBookingQuerySchema, "query"),
  adminController.listBookings,
);
router.get("/bookings/:id", adminController.getBookingById);

router.use("/categories", adminCategoryRoutes);

export default router;
