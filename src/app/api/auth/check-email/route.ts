import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Now this will work!

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const credential = await prisma.credentials.findFirst({
      where: {
        gmail: email,
      },
  });

    return NextResponse.json({ exists: !!credential });
  } catch (error) {
    console.error("Error checking email with Prisma:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}