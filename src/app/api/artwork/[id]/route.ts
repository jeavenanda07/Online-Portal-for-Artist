import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  // 1. Change the type of params to a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Await the params to get the id
    const { id } = await params;

    const artwork = await prisma.artwork.findUnique({
      where: { artwork_id: id },
      include: {
        user_profile: {
          select: {
            user_profile_id: true,
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
      },
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (err) {
    console.error("GET artwork error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}