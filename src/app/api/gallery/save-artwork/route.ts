import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { gallery_id, artwork_id } = await req.json();

    if (!gallery_id || !artwork_id) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    const existing = await prisma.galleryArtwork.findUnique({
      where: { gallery_id_artwork_id: { gallery_id, artwork_id } },
    });

    if (existing) {
      await prisma.galleryArtwork.delete({
        where: { gallery_id_artwork_id: { gallery_id, artwork_id } },
      });
      return NextResponse.json({ saved: false }, { status: 200 });
    }

    await prisma.galleryArtwork.create({ data: { gallery_id, artwork_id } });
    return NextResponse.json({ saved: true }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const artwork_id = req.nextUrl.searchParams.get("artwork_id");
    const user_profile_id = req.nextUrl.searchParams.get("user_profile_id");

    if (!artwork_id || !user_profile_id) {
      return NextResponse.json({ savedGalleryIds: [] }, { status: 200 });
    }

    const saved = await prisma.galleryArtwork.findMany({
      where: {
        artwork_id,
        gallery: { user_profile_id },
      },
      select: { gallery_id: true },
    });

    return NextResponse.json({
      savedGalleryIds: saved.map((s) => s.gallery_id),
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}