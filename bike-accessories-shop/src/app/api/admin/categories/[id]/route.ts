import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  countProductsInCategory,
  isValidObjectId,
  isDuplicateKeyError,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { adminCategorySchema } from "@/lib/admin-validation";
import { toSlug } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

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

  const existing = await getCategoryById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

  try {
    const category = await updateCategoryById(id, {
      name: data.name,
      slug,
      image: data.image ?? null,
    });

    return NextResponse.json({ category });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
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

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

  const existing = await getCategoryById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Category not found." },
      { status: 404 }
    );
  }

  const productsCount = await countProductsInCategory(id);
  if (productsCount > 0) {
    return NextResponse.json(
      {
        error:
          "This category still contains products. Move or delete them first.",
      },
      { status: 409 }
    );
  }

  try {
    await deleteCategoryById(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to delete category ${id}:`, error);
    return NextResponse.json(
      { error: "Could not delete the category. Please try again." },
      { status: 500 }
    );
  }
}
