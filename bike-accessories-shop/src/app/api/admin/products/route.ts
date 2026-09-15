import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import {
  listAdminProducts,
  createProduct,
  categoryExists,
  isDuplicateKeyError,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { adminProductSchema } from "@/lib/admin-validation";
import { toSlug, rupeesToPaise } from "@/lib/utils";

const IMAGE_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function bufferMatchesImage(buffer: Buffer, mime: string): boolean {
  if (mime === "image/png") {
    return buffer.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC);
  }
  if (mime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  if (mime === "image/gif") {
    const head = buffer.subarray(0, 6).toString("ascii");
    return head === "GIF87a" || head === "GIF89a";
  }
  return false;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const products = await listAdminProducts();

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
      subCategory: formData.get("subCategory") ?? undefined,
      featured: formData.get("featured") ?? undefined,
      active: formData.get("active") ?? undefined,
      imageUrl: imageUrl ?? undefined,
    };

    parsed = adminProductSchema.safeParse(data);

    if (parsed.success && file instanceof File && file.size > 0) {
      const extension = IMAGE_MIME[file.type];
      if (!extension) {
        return NextResponse.json(
          { error: "Unsupported image type. Use PNG, JPEG, WebP or GIF." },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Image must be 5 MB or smaller." },
          { status: 413 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      if (!bufferMatchesImage(buffer, file.type)) {
        return NextResponse.json(
          { error: "The uploaded file does not match its image type." },
          { status: 400 }
        );
      }

      try {
        const blob = await put(`${randomUUID()}${extension}`, buffer, {
          access: "public",
          contentType: file.type,
        });
        parsed.data.imageUrl = blob.url;
      } catch (error) {
        console.error("Failed to upload product image to Blob storage:", error);
        return NextResponse.json(
          { error: "Failed to upload the product image. Please try again." },
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
    const category = await categoryExists(data.categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "The selected category doesn't exist." },
        { status: 400 }
      );
    }

    const product = await createProduct({
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Could not create the product. Please try again." },
      { status: 500 }
    );
  }
}
