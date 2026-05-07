import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user_profile_id = req.nextUrl.searchParams.get("user_profile_id");

    if (!user_profile_id) {
      return NextResponse.json(
        { message: "user_profile_id is required." },
        { status: 400 }
      );
    }

    const artworks = await prisma.artwork.findMany({
      where: { user_profile_id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ artworks }, { status: 200 });

  } catch (err: any) {
    console.error("Get artworks error:", err.message);
    return NextResponse.json(
      { message: err.message || "Failed to fetch artworks." },
      { status: 500 }
    );
  }
}