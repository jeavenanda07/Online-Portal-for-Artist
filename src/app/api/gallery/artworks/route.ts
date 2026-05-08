import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const gallery_id = req.nextUrl.searchParams.get("gallery_id");

    if (!gallery_id) {
      return NextResponse.json({ message: "gallery_id required." }, { status: 400 });
    }

    const galleryArtworks = await prisma.galleryArtwork.findMany({
      where: { gallery_id },
      orderBy: { added_at: "desc" },
      include: {
        artwork: {
          select: {
            artwork_id: true,
            art_file: true,
            artwork_title: true,
            status: true,
            price: true,
            likes_count: true,
            user_profile: {
              select: {
                full_name: true,
                username: true,
                avatar_pic: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      artworks: galleryArtworks.map((ga) => ({
        ...ga.artwork,
        added_at: ga.added_at,
      })),
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}