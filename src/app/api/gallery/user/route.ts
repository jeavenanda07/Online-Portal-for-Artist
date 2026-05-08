import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user_profile_id = req.nextUrl.searchParams.get("user_profile_id");

    if (!user_profile_id) {
      return NextResponse.json({ message: "user_profile_id required." }, { status: 400 });
    }

    const galleries = await prisma.gallery.findMany({
      where: { user_profile_id },
      orderBy: { created_at: "desc" },
      include: {
        artworks: {
          include: {
            artwork: { select: { art_file: true } },
          },
          take: 1, // just for cover preview
        },
        _count: { select: { artworks: true } },
      },
    });

    return NextResponse.json({ galleries }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}