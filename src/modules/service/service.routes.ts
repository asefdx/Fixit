import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { serviceController } from "./service.controller";
import {
  serviceQuerySchema,
  serviceSchema,
  updateServiceSchema,
} from "./service.validation";

const router = Router();

router.get(
  "/",
  validateRequest(serviceQuerySchema, "query"),
  serviceController.listServices,
);
router.get("/:id", serviceController.getServiceById);

router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(serviceSchema),
  serviceController.createService,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  validateRequest(updateServiceSchema),
  serviceController.updateService,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.TECHNICIAN, UserRole.ADMIN),
  serviceController.deleteService,
);

export default router;
