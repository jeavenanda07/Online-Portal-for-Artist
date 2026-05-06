import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user_profile_id, content, media, visibility } = await req.json();

    console.log("Creating post for:", user_profile_id);
    console.log("Content:", content);
    console.log("Media URLs:", media);
    console.log("Visibility:", visibility);

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

    console.log("Post created:", post.post_id);
    return NextResponse.json({ post }, { status: 201 });

  } catch (err: any) {
    console.error("Create post error:", err.message);
    return NextResponse.json({ message: err.message || "Failed to create post." }, { status: 500 });
  }
}