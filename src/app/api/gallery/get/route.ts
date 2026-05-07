import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const galleries = await prisma.gallery.findMany({
    where: { user_profile_id: userId },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(galleries);
}