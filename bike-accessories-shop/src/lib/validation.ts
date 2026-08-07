import { z } from "zod";

export const indianPhoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^(\+91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
  );

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: indianPhoneSchema,
  address: z.string().trim().min(10, "Enter your complete street address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  postalCode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
  orderNotes: z
    .string()
    .trim()
    .max(500, "Keep order notes under 500 characters")
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const createOrderRequestSchema = z.object({
  customer: checkoutSchema,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1)
    .max(50),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const verifyPaymentRequestSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  signature: z.string().min(1),
});

export type VerifyPaymentRequest = z.infer<typeof verifyPaymentRequestSchema>;
