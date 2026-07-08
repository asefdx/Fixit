import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters"),
  description: z.string().trim().optional(),
  iconUrl: z.string().url("Icon must be a valid URL").optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
