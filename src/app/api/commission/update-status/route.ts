import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { artRequestId, status } = await req.json();

    if (!artRequestId || !status) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    const updated = await prisma.artRequest.update({
      where: { art_request_id: artRequestId },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: "Failed to update status." }, { status: 500 });
  }
}