import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

export default router;
