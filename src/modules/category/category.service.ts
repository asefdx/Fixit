import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { slugify } from "../../utils/slugify";
import type { CategoryInput, UpdateCategoryInput } from "./category.validation";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  iconUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const categoryService = {
  async listCategories(includeInactive = false) {
    return prisma.category.findMany({
      where: includeInactive
        ? undefined
        : {
            isActive: true,
          },
      select: categorySelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: categorySelect,
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    return category;
  },

  async createCategory(payload: CategoryInput) {
    const slug = slugify(payload.name);

    const category = await prisma.category.create({
      data: {
        name: payload.name,
        slug,
        description: payload.description,
        iconUrl: payload.iconUrl,
        isActive: payload.isActive ?? true,
      },
      select: categorySelect,
    });

    return category;
  },

  async updateCategory(categoryId: string, payload: UpdateCategoryInput) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new AppError(404, "Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: payload.name,
        slug: payload.name ? slugify(payload.name) : undefined,
        description: payload.description,
        iconUrl: payload.iconUrl,
        isActive: payload.isActive,
      },
      select: categorySelect,
    });

    return updatedCategory;
  },

  async deleteCategory(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        isActive: false,
      },
    });

    return {
      message: "Category deleted successfully",
    };
  },
};
