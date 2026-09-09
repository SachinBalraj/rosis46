import { NextRequest, NextResponse } from "next/server";
import {
  getContactMessageById,
  setContactMessageStatus,
  deleteContactMessage,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { updateContactMessageStatusSchema } from "@/lib/admin-validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const message = await getContactMessageById(id);
  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json({ message });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let parsed;
  try {
    parsed = updateContactMessageStatusSchema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message status" },
      { status: 400 }
    );
  }

  const existing = await getContactMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  try {
    const message = await setContactMessageStatus(id, parsed.data.status);

    return NextResponse.json({ message });
  } catch (error) {
    console.error(`Failed to update contact message ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the message. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const existing = await getContactMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  try {
    await deleteContactMessage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to delete contact message ${id}:`, error);
    return NextResponse.json(
      { error: "Could not delete the message. Please try again." },
      { status: 500 }
    );
  }
}