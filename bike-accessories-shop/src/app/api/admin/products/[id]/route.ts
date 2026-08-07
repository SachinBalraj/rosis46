import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  adminProductSchema,
  prismaErrorCode,
} from "@/lib/admin-validation";
import { toSlug, rupeesToPaise } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let parsed;
  try {
    parsed = adminProductSchema.safeParse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || toSlug(data.name);
  if (!slug) {
    return NextResponse.json(
      { error: "Could not build a slug from the product name" },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
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
      data: {
        name: data.name,
        slug,
        description: data.description,
        priceInPaise: rupeesToPaise(data.price),
        salePriceInPaise:
          data.salePrice !== undefined ? rupeesToPaise(data.salePrice) : null,
        stock: data.stock,
        imageUrl: data.imageUrl ?? null,
        categoryId: data.categoryId,
        featured: data.featured,
        active: data.active,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ product });
  } catch (error) {
    const code = prismaErrorCode(error);
    if (code === "P2002") {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    if (code === "P2003") {
      return NextResponse.json(
        { error: "The selected category doesn't exist." },
        { status: 400 }
      );
    }
    console.error(`Failed to update product ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the product. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const existing = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      _count: { select: { orderItems: true } },
    },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  if (existing._count.orderItems > 0) {
    return NextResponse.json(
      {
        error:
          "This product is part of past orders and can't be deleted. Deactivate it instead.",
      },
      { status: 409 }
    );
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    return NextResponse.json(
      { error: "Could not delete the product. Please try again." },
      { status: 500 }
    );
  }
}
