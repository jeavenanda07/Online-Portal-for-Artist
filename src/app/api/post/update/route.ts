// app/api/post/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  let id: string = ''
  try {
    const { postId, content } = await req.json();
    id = postId

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required." },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        post_id: postId,
      },
      data: {
        content,
      },
    });

    return NextResponse.json(
      { post: updatedPost, message: "Post updated successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Update post error:", err.message);
    return NextResponse.json(
      { message: err.message || `Failed to update post.` },
      { status: 500 }
    );
  }
}