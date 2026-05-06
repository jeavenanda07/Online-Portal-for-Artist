import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { artworkId } = await req.json();

    if (!artworkId) {
      return NextResponse.json({ message: "Artwork ID is required." }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { artwork_id: artworkId },
      select: { art_file: true },
    });

    if (!artwork) {
      return NextResponse.json({ message: "Artwork not found." }, { status: 404 });
    }

    const filePath = artwork.art_file.split("/storage/v1/object/public/artworks/")[1];
    if (filePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("artworks")
        .remove([filePath]);
      if (storageError) console.error("Storage delete error:", storageError.message);
    }

    await prisma.artwork.delete({ where: { artwork_id: artworkId } });

    return NextResponse.json({ message: "Artwork deleted." }, { status: 200 });

  } catch (err: any) {
    console.error("Delete artwork error:", err.message);
    return NextResponse.json({ message: "Failed to delete artwork." }, { status: 500 });
  }
}