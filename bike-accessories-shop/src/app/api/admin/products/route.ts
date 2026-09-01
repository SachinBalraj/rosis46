import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  adminProductSchema,
  prismaErrorCode,
} from "@/lib/admin-validation";
import { toSlug, rupeesToPaise } from "@/lib/utils";

const IMAGE_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

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

  const contentType = request.headers.get("content-type") ?? "";

  let parsed;
  if (contentType.toLowerCase().includes("multipart/form-data")) {
    const formData = await request.formData();

    const file = formData.get("image");
    const imageUrl = formData.get("imageUrl");

    const data: Record<string, FormDataEntryValue | undefined> = {
      name: formData.get("name") ?? undefined,
      description: formData.get("description") ?? undefined,
      price: formData.get("price") ?? undefined,
      salePrice: formData.get("salePrice") ?? undefined,
      stock: formData.get("stock") ?? undefined,
      categoryId: formData.get("categoryId") ?? undefined,
      featured: formData.get("featured") ?? undefined,
      active: formData.get("active") ?? undefined,
      imageUrl: imageUrl ?? undefined,
    };

    parsed = adminProductSchema.safeParse(data);

    if (parsed.success && file instanceof File && file.size > 0) {
      const extension = IMAGE_MIME[file.type];
      if (!extension) {
        return NextResponse.json(
          {
            error:
              "Unsupported image type. Use PNG, JPEG, WebP, GIF or SVG.",
          },
          { status: 400 }
        );
      }

      try {
        const filename = `${randomUUID()}${extension}`;
        const dir = path.join(process.cwd(), "public", "images", "products");
        await mkdir(dir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(dir, filename), buffer);
        parsed.data.imageUrl = `/images/products/${filename}`;
      } catch {
        return NextResponse.json(
          { error: "Could not save the uploaded image. Please try again." },
          { status: 500 }
        );
      }
    }
  } else {
    try {
      parsed = adminProductSchema.safeParse(await request.json());
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
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
