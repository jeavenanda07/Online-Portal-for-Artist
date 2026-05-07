import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { post_id, user_profile_id, content } = await req.json();

    if (!post_id || !user_profile_id || !content?.trim()) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    const comment = await prisma.postComment.create({
      data: { post_id, user_profile_id, content: content.trim() },
      include: {
        user_profile: {
          select: {
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });

  } catch (err: any) {
    console.error("Comment error:", err.message);
    return NextResponse.json({ message: "Failed to post comment." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const post_id = req.nextUrl.searchParams.get("post_id");

    if (!post_id) {
      return NextResponse.json({ message: "post_id is required." }, { status: 400 });
    }

    const comments = await prisma.postComment.findMany({
      where: { post_id },
      orderBy: { created_at: "asc" },
      include: {
        user_profile: {
          select: {
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
      },
    });

    return NextResponse.json({ comments }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: "Failed to fetch comments." }, { status: 500 });
  }
}