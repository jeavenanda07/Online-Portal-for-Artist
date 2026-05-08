import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();

  const me = await prisma.userProfile.findFirst({
    where: { username: { in: [session.username, `@${session.username}`] } },
  });

  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (me.user_profile_id === targetUserId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  const existing = await prisma.follow.findUnique({
    where: { follower_id_following_id: { follower_id: me.user_profile_id, following_id: targetUserId } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { follower_id_following_id: { follower_id: me.user_profile_id, following_id: targetUserId } },
    });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({
    data: { follower_id: me.user_profile_id, following_id: targetUserId },
  });

  return NextResponse.json({ following: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("targetUserId");
  const myId = searchParams.get("myId");

  if (!targetUserId || !myId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const [followersCount, followingCount, isFollowing] = await Promise.all([
    prisma.follow.count({ where: { following_id: targetUserId } }),
    prisma.follow.count({ where: { follower_id: targetUserId } }),
    prisma.follow.findUnique({
      where: { follower_id_following_id: { follower_id: myId, following_id: targetUserId } },
    }),
  ]);

  return NextResponse.json({ followersCount, followingCount, isFollowing: !!isFollowing });
}