import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(req: NextRequest) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ message: "Post ID is required." }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const post = await prisma.post.findUnique({
      where: { post_id: postId },
      select: { media: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    if (post.media && post.media.length > 0) {

      const filePaths = post.media.map((url) => {
        const parts = url.split("/storage/v1/object/public/posts/");
        return parts[1]; 
      }).filter(Boolean);

      console.log("Deleting from storage:", filePaths);

      const { error: storageError } = await supabaseAdmin.storage
        .from("posts")
        .remove(filePaths);

      if (storageError) {
        console.error("Storage delete error:", storageError.message);
      }
    }

    await prisma.post.delete({
      where: { post_id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully." }, { status: 200 });

  } catch (err: any) {
    console.error("Delete post error:", err.message);
    return NextResponse.json({ message: "Failed to delete post." }, { status: 500 });
  }
}