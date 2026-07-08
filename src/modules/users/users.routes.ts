import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { usersController } from "./users.controller";
import { changePasswordSchema, updateProfileSchema } from "./users.validation";

const router = Router();

router.get("/:id", authenticate, usersController.getUserById);
router.patch(
  "/profile",
  authenticate,
  validateRequest(updateProfileSchema),
  usersController.updateProfile,
);
router.patch(
  "/password",
  authenticate,
  validateRequest(changePasswordSchema),
  usersController.changePassword,
);

export default router;
