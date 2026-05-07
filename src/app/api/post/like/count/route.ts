import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const post_id = req.nextUrl.searchParams.get("post_id");
    const user_profile_id = req.nextUrl.searchParams.get("user_profile_id");

    if (!post_id) {
      return NextResponse.json({ message: "post_id is required." }, { status: 400 });
    }

    const count = await prisma.postLike.count({ where: { post_id } });

    const isLiked = user_profile_id
      ? !!(await prisma.postLike.findUnique({
          where: { post_id_user_profile_id: { post_id, user_profile_id } },
        }))
      : false;

    return NextResponse.json({ count, isLiked }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}