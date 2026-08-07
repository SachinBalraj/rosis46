import { NextRequest, NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") ?? undefined;
    const featured = searchParams.get("featured");
    const query = searchParams.get("q") ?? undefined;
    const limitParam = searchParams.get("limit");

    const limit =
      limitParam && /^\d+$/.test(limitParam)
        ? Math.min(Math.max(parseInt(limitParam, 10), 1), 50)
        : undefined;

    const products = await getActiveProducts({
      category,
      featured:
        featured === "true" ? true : featured === "false" ? false : undefined,
      query,
      limit,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to list products:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
