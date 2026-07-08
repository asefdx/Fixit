import { Router } from "express";
import { UserRole } from "@prisma/client";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import { categorySchema, updateCategorySchema } from "./category.validation";

const router = Router();

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(categorySchema),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  categoryController.deleteCategory,
);

export default router;
