import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ message: "username required" }, { status: 400 });

  const profile = await prisma.userProfile.findFirst({
    where: { OR: [{ username }, { username: `@${username}` }] },
  });

  if (!profile) return NextResponse.json({ posts: [] }, { status: 200 });

  const posts = await prisma.post.findMany({
    where: { user_profile_id: profile.user_profile_id },
    orderBy: { date_posted: "desc" },
  });

  return NextResponse.json({ posts }, { status: 200 });
}