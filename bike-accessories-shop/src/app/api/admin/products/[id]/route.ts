import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import {
  updateProductById,
  getProductById,
  deleteProductById,
  countOrderItemsForProduct,
  categoryExists,
  isValidObjectId,
  isDuplicateKeyError,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { adminProductSchema } from "@/lib/admin-validation";
import { toSlug, rupeesToPaise } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
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

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  try {
    const category = await categoryExists(data.categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "The selected category doesn't exist." },
        { status: 400 }
      );
    }

    const product = await updateProductById(id, {
      name: data.name,
      slug,
      description: data.description,
      priceInPaise: rupeesToPaise(data.price),
      salePriceInPaise:
        data.salePrice !== undefined ? rupeesToPaise(data.salePrice) : null,
      stock: data.stock,
      imageUrl: data.imageUrl ?? null,
      categoryId: data.categoryId,
      subCategory: data.subCategory,
      featured: data.featured,
      active: data.active,
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
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

  const orderItemsCount = await countOrderItemsForProduct(id);
  if (orderItemsCount > 0) {
    return NextResponse.json(
      {
        error:
          "This product is part of past orders and can't be deleted. Deactivate it instead.",
      },
      { status: 409 }
    );
  }

  try {
    if (
      existing.imageUrl &&
      existing.imageUrl.includes("public.blob.vercel-storage.com")
    ) {
      await del(existing.imageUrl).catch((error) => {
        console.error("Failed to delete product image from Blob storage:", error);
      });
    }
    await deleteProductById(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    return NextResponse.json(
      { error: "Could not delete the product. Please try again." },
      { status: 500 }
    );
  }
}
