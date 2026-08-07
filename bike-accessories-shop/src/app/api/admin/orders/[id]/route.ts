import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { updateOrderStatusSchema } from "@/lib/admin-validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let parsed;
  try {
    parsed = updateOrderStatusSchema.safeParse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order status" },
      { status: 400 }
    );
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error(`Failed to update order ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the order. Please try again." },
      { status: 500 }
    );
  }
}
