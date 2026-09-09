import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";
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

  try {
    const order = await updateOrderStatus(id, parsed.data.status);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error(`Failed to update order ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the order. Please try again." },
      { status: 500 }
    );
  }
}
