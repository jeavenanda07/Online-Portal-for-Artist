import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      user_profile_id,
      title,
      description,
      visibility,
      cover_image,
    } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const gallery = await prisma.gallery.create({
      data: {
        user_profile_id,
        title,
        slug,
        description,
        visibility,
        cover_image,
      },
    });

    return NextResponse.json(gallery);

  } catch (error) {

    console.error("CREATE GALLERY ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create gallery" },
      { status: 500 }
    );
  }
}