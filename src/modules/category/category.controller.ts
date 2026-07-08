import type { Response } from "express";
import { UserRole } from "@prisma/client";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

const requireAdmin = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError(403, "Forbidden");
  }
};

export const categoryController = {
  listCategories: catchAsync(async (_req, res: Response) => {
    const categories = await categoryService.listCategories();

    return sendResponse({
      res,
      message: "Categories retrieved successfully",
      data: categories,
    });
  }),

  getCategoryById: catchAsync(async (req, res: Response) => {
    const categoryId = getParamId(req.params.id, "Category id is required");
    const category = await categoryService.getCategoryById(categoryId);

    return sendResponse({
      res,
      message: "Category retrieved successfully",
      data: category,
    });
  }),

  createCategory: catchAsync(async (req, res: Response) => {
    requireAdmin(req as AuthenticatedRequest);
    const category = await categoryService.createCategory(req.body);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  }),

  updateCategory: catchAsync(async (req, res: Response) => {
    requireAdmin(req as AuthenticatedRequest);
    const categoryId = getParamId(req.params.id, "Category id is required");
    const category = await categoryService.updateCategory(categoryId, req.body);

    return sendResponse({
      res,
      message: "Category updated successfully",
      data: category,
    });
  }),

  deleteCategory: catchAsync(async (req, res: Response) => {
    requireAdmin(req as AuthenticatedRequest);
    const categoryId = getParamId(req.params.id, "Category id is required");
    const result = await categoryService.deleteCategory(categoryId);

    return sendResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
};
