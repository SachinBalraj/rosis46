import { NextResponse } from "next/server";
import { listContactMessages } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const messages = await listContactMessages();

  return NextResponse.json({ messages });
}