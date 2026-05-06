import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Received Profile Data:", await req.clone().text()); // Log raw request body for debugging
  try {
    const data = await req.json();

  

    const profile = await prisma.userProfile.create({
      data: {
        credentials_id: data.credentials_id,
        full_name: data.full_name,
        username: data.username,
        gender: data.gender,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        avatar_pic: data.avatar_pic || null,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }
}