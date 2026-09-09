import { NextResponse } from "next/server";
import {
  getProductById,
  toggleProductActive,
  isValidObjectId,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  try {
    const product = await toggleProductActive(id, !existing.active);
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`Failed to toggle product ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the product. Please try again." },
      { status: 500 }
    );
  }
}
