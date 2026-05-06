// app/api/post/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required." },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { post_id: postId }, // Assumes the primary key is 'id'. Adjust if 'post_id' is used.
    });

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Delete post error:", err.message);
    return NextResponse.json(
      { message: "Failed to delete post." },
      { status: 500 }
    );
  }
}