import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return jsonError("An account with this email already exists.", 409);
  }

  const passwordHash = await hash(password, 12);

  try {
    await prisma.user.create({
      data: { name, email, phone, passwordHash },
      select: { id: true },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError("An account with this email already exists.", 409);
    }
    console.error("Failed to create user:", error);
    return jsonError("Could not create your account. Please try again.", 500);
  }

  return NextResponse.json<RegisterResponse>({ ok: true });
}
