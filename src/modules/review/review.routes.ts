import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewController } from "./review.controller";
import { createReviewSchema, reviewListQuerySchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.CUSTOMER),
  validateRequest(createReviewSchema),
  reviewController.createReview,
);

router.get(
  "/service/:serviceId",
  validateRequest(reviewListQuerySchema, "query"),
  reviewController.listReviewsByService,
);
router.get(
  "/technician/:technicianId",
  validateRequest(reviewListQuerySchema, "query"),
  reviewController.listReviewsByTechnician,
);

export default router;
