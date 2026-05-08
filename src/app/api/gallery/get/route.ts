import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const galleries =
      await prisma.gallery.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

    return NextResponse.json(galleries);

  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch galleries",
      },
      {
        status: 500,
      }
    );
  }
}