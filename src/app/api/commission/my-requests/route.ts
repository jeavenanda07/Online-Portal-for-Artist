import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";
import { getUserInfo } from "@/app/actions/user";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json([], { status: 401 });

    const userInfo = await getUserInfo(session.username);
    if (!userInfo) return NextResponse.json([], { status: 404 });

    const requests = await prisma.artRequest.findMany({
      where: { client_id: userInfo.user_profile_id },
      orderBy: { created_at: "desc" },
      include: {
        artist: {
          select: { full_name: true, username: true, avatar_pic: true },
        },
        client: {
          select: { full_name: true, username: true, avatar_pic: true },
        },
      },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json([], { status: 500 });
  }
}