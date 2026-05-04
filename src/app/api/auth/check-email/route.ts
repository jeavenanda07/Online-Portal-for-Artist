// app/api/auth/check-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const credentials = await prisma.credentials.findUnique({
    where: { gmail: email },
    include: { user_profile: true }, // 👈 include the profile
  });

  return NextResponse.json({
    exists: !!credentials,                        // email is registered
    hasProfile: !!credentials?.user_profile,      // profile setup is done
  });
}