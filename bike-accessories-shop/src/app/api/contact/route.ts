import { NextRequest, NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type ContactResponse = { ok: boolean; error?: string };

function jsonError(message: string, status: number) {
  return NextResponse.json<ContactResponse>(
    { ok: false, error: message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  const limited = rateLimit({
    key: `contact:${getClientIp(request)}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return jsonError(limited.message, 429);
  }

  let parsed;
  try {
    parsed = contactMessageSchema.safeParse(await request.json());
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Please check your message",
      400
    );
  }

  const { name, email, contactNumber, message } = parsed.data;

  try {
    await createContactMessage({
      name,
      email,
      contactNumber: contactNumber ?? null,
      message,
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return jsonError("Could not save your message. Please try again.", 500);
  }

  return NextResponse.json<ContactResponse>({ ok: true });
}