import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  adminProductSchema,
  prismaErrorCode,
} from "@/lib/admin-validation";
import { toSlug, rupeesToPaise } from "@/lib/utils";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

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

  try {
    const product = await prisma.product.create({
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

    return NextResponse.json({ product }, { status: 201 });
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
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Could not create the product. Please try again." },
      { status: 500 }
    );
  }
}
