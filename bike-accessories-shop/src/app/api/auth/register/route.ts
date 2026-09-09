import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { findUserByEmail, createUser, isDuplicateKeyError } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
});

type RegisterResponse = { ok: boolean; error?: string };

function jsonError(message: string, status: number) {
  return NextResponse.json<RegisterResponse>(
    { ok: false, error: message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  const limited = rateLimit({
    key: `register:${getClientIp(request)}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return jsonError(limited.message, 429);
  }

  let parsed;
  try {
    parsed = registerSchema.safeParse(await request.json());
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid registration details",
      400
    );
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return jsonError(
      "Could not create your account. Verify your details or try again.",
      409
    );
  }

  const passwordHash = await hash(password, 12);

  try {
    await createUser({ name, email, phone, passwordHash });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return jsonError(
        "Could not create your account. Verify your details or try again.",
        409
      );
    }
    console.error("Failed to create user:", error);
    return jsonError("Could not create your account. Please try again.", 500);
  }

  return NextResponse.json<RegisterResponse>({ ok: true });
}
