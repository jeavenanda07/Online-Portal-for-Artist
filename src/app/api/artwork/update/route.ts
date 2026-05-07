import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { artworkId, artwork_title, description, status, price, stocks, tags } = await req.json();

    if (!artworkId) {
      return NextResponse.json({ message: "Artwork ID is required." }, { status: 400 });
    }

    const updated = await prisma.artwork.update({
      where: { artwork_id: artworkId },
      data: { artwork_title, description, status, price, stocks, tags },
    });

    return NextResponse.json({ artwork: updated }, { status: 200 });

  } catch (err: any) {
    console.error("Update artwork error:", err.message);
    return NextResponse.json({ message: "Failed to update artwork." }, { status: 500 });
  }
}