import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true, active: true },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { active: !existing.active },
      select: { id: true, active: true },
    });
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`Failed to toggle product ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the product. Please try again." },
      { status: 500 }
    );
  }
}
