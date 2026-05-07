import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const artwork_id = req.nextUrl.searchParams.get("artwork_id");

    if (!artwork_id) {
      return NextResponse.json({ message: "artwork_id is required." }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { artwork_id },
      select: { art_file: true, artwork_title: true, status: true },
    });

    if (!artwork) {
      return NextResponse.json({ message: "Artwork not found." }, { status: 404 });
    }

    if (artwork.status !== "Free Download") {
      return NextResponse.json({ message: "This artwork is not available for download." }, { status: 403 });
    }

    // Fetch the image from Supabase Storage
    const imageRes = await fetch(artwork.art_file);
    if (!imageRes.ok) {
      return NextResponse.json({ message: "Failed to fetch image." }, { status: 500 });
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const ext = artwork.art_file.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `${artwork.artwork_title.replace(/\s+/g, "_")}.${ext}`;

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": imageBuffer.byteLength.toString(),
      },
    });

  } catch (err: any) {
    console.error("Download error:", err.message);
    return NextResponse.json({ message: "Download failed." }, { status: 500 });
  }
}