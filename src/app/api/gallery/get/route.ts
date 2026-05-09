import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/actions/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Allow explicit userId param (for public profile pages)
    // Fall back to session user (for own gallery modal)
    let userId = searchParams.get("userId");

    if (!userId) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const me = await prisma.userProfile.findFirst({
        where: {
          OR: [
            { username: session.username },
            { username: `@${session.username}` },
          ],
        },
        select: { user_profile_id: true },
      });

      if (!me) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      userId = me.user_profile_id;
    }

    const galleries = await prisma.gallery.findMany({
      where: { user_profile_id: userId },   // ✅ always filtered by user
      orderBy: { created_at: "desc" },
      include: {
        _count: { select: { artworks: true } }, // artwork count per gallery
      },
    });

    return NextResponse.json(galleries);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}