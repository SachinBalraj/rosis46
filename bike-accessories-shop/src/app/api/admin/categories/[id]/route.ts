import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { adminCategorySchema, prismaErrorCode } from "@/lib/admin-validation";
import { toSlug } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let parsed;
  try {
    parsed = adminCategorySchema.safeParse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid category data" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || toSlug(data.name);
  if (!slug) {
    return NextResponse.json(
      { error: "Could not build a slug from the category name" },
      { status: 400 }
    );
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        image: data.image ?? null,
      },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({ category });
  } catch (error) {
    const code = prismaErrorCode(error);
    if (code === "P2002") {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 }
      );
    }
    console.error(`Failed to update category ${id}:`, error);
    return NextResponse.json(
      { error: "Could not update the category. Please try again." },
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

  const existing = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      _count: { select: { products: true } },
    },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

  if (existing._count.products > 0) {
    return NextResponse.json(
      {
        error:
          "This category still contains products. Move or delete them first.",
      },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to delete category ${id}:`, error);
    return NextResponse.json(
      { error: "Could not delete the category. Please try again." },
      { status: 500 }
    );
  }
}
