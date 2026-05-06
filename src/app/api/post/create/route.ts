import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user_profile_id, content, media, visibility } = await req.json();

    if (!user_profile_id) {
      return NextResponse.json({ message: "User not found." }, { status: 401 });
    }

    if (!content && media.length === 0) {
      return NextResponse.json({ message: "Post cannot be empty." }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        user_profile_id,
        content,
        media,
        visibility,
      },
    });

    return NextResponse.json({ post }, { status: 201 });

  } catch (err: any) {
    console.error("Create post error:", err.message);
    return NextResponse.json({ message: "Failed to create post." }, { status: 500 });
  }
}