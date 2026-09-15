import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const slugSchema = z
  .union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens"
      ),
  ])
  .optional();

export const adminProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(120, "Keep the name under 120 characters"),
    slug: slugSchema,
    description: z
      .string()
      .trim()
      .min(10, "Describe the product in at least 10 characters"),
    price: z.coerce
      .number({ message: "Enter the regular price" })
      .positive("Price must be greater than zero")
      .max(100_000_000, "Price is unreasonably high"),
    salePrice: z
      .preprocess(
        emptyToUndefined,
        z.coerce
          .number({ message: "Enter a valid sale price" })
          .nonnegative("Sale price can't be negative")
          .optional()
      )
      .optional(),
    stock: z.coerce
      .number({ message: "Enter the stock quantity" })
      .int("Stock must be a whole number")
      .min(0, "Stock can't be negative"),
    imageUrl: z
      .preprocess(
        emptyToUndefined,
        z
          .string()
          .trim()
          .url("Enter a valid image URL")
          .max(2000)
          .optional()
      )
      .optional(),
    categoryId: z.string().min(1, "Choose a category"),
    subCategory: z
      .preprocess(
        emptyToUndefined,
        z
          .string()
          .trim()
          .max(80, "Keep the sub-category under 80 characters")
          .optional()
      )
      .optional(),
    featured: z
      .union([z.boolean(), z.string()])
      .transform((value) => value === true || value === "true")
      .default(false),
    active: z
      .union([z.boolean(), z.string()])
      .transform((value) => value === true || value === "true")
      .default(true),
  })
  .refine(
    (data) => data.salePrice === undefined || data.salePrice < data.price,
    {
      message: "Sale price must be lower than the regular price",
      path: ["salePrice"],
    }
  );

export type AdminProductInput = z.infer<typeof adminProductSchema>;
export type AdminProductFormInput = z.input<typeof adminProductSchema>;
export type AdminProductFormOutput = z.output<typeof adminProductSchema>;

export const adminCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Keep the name under 80 characters"),
  slug: slugSchema,
  image: z
    .preprocess(
      emptyToUndefined,
      z.string().trim().url("Enter a valid image URL").max(2000).optional()
    )
    .optional(),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
export type AdminCategoryFormInput = z.input<typeof adminCategorySchema>;
export type AdminCategoryFormOutput = z.output<typeof adminCategorySchema>;

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const PAYMENT_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES, {
    error: "Choose a valid fulfilment status",
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const CONTACT_MESSAGE_STATUS_VALUES = [
  "NEW",
  "READ",
  "REPLIED",
  "ARCHIVED",
] as const;

export const updateContactMessageStatusSchema = z.object({
  status: z.enum(CONTACT_MESSAGE_STATUS_VALUES, {
    error: "Choose a valid message status",
  }),
});

export type UpdateContactMessageStatusInput = z.infer<
  typeof updateContactMessageStatusSchema
>;
