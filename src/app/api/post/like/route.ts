import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { post_id, user_profile_id } = await req.json();

    if (!post_id || !user_profile_id) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    const existing = await prisma.postLike.findUnique({
      where: { post_id_user_profile_id: { post_id, user_profile_id } },
    });

    if (existing) {
      await prisma.postLike.delete({
        where: { post_id_user_profile_id: { post_id, user_profile_id } },
      });
      const count = await prisma.postLike.count({ where: { post_id } });
      return NextResponse.json({ liked: false, count }, { status: 200 });
    } else {
      await prisma.postLike.create({ data: { post_id, user_profile_id } });
      const count = await prisma.postLike.count({ where: { post_id } });
      return NextResponse.json({ liked: true, count }, { status: 200 });
    }

  } catch (err: any) {
    console.error("Like error:", err.message);
    return NextResponse.json({ message: "Failed to toggle like." }, { status: 500 });
  }
}