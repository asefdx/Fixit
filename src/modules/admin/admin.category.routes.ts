import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryController } from "../category/category.controller";
import {
  categorySchema,
  updateCategorySchema,
} from "../category/category.validation";

const router = Router();

router.use(authenticate, authorizeRoles(UserRole.ADMIN));

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategoryById);
router.post(
  "/",
  validateRequest(categorySchema),
  categoryController.createCategory,
);
router.patch(
  "/:id",
  validateRequest(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/:id", categoryController.deleteCategory);

export default router;
