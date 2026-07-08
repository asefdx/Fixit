import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { technicianController } from "./technician.controller";
import {
  availabilitySchema,
  technicianListQuerySchema,
  technicianProfileSchema,
  updateAvailabilitySchema,
} from "./technician.validation";

const router = Router();

router.get(
  "/",
  validateRequest(technicianListQuerySchema, "query"),
  technicianController.listTechnicians,
);
router.get("/:id", technicianController.getTechnicianProfile);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(technicianProfileSchema),
  technicianController.updateProfile,
);

router.get(
  "/availability",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  technicianController.getAvailability,
);

router.post(
  "/availability",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(availabilitySchema),
  technicianController.createAvailability,
);

router.patch(
  "/availability/:id",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(updateAvailabilitySchema),
  technicianController.updateAvailability,
);

router.delete(
  "/availability/:id",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  technicianController.deleteAvailability,
);

export default router;
