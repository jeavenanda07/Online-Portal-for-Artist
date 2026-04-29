import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, gmail } = await req.json();

    const user = await prisma.credentials.upsert({
      where: { user_id: user_id }, 
      update: { last_signin_at: new Date(), is_logged_in: true },
      create: {
        user_id: user_id,
        gmail: gmail,
        password: "", 
        role: "User",
        is_logged_in: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}