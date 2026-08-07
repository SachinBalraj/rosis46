import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db";

export async function GET() {
  try {
    const categories = await getCategoriesWithCounts();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to list categories:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
