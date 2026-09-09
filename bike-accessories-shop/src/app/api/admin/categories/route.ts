import { NextRequest, NextResponse } from "next/server";
import {
  listAdminCategories,
  createCategory,
  isDuplicateKeyError,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { adminCategorySchema } from "@/lib/admin-validation";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const categories = await listAdminCategories();

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

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

  try {
    const category = await createCategory({
      name: data.name,
      slug,
      image: data.image ?? null,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Could not create the category. Please try again." },
      { status: 500 }
    );
  }
}
