import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import { notify } from "@/utils/toastHelper";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const profile = await prisma.userProfile.create({
      data: {
        credentials_id: data.credentials_id,
        full_name: data.full_name,
        username: data.username,
        gender: data.gender,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        // Fixed: changed data.avatar_url to data.avatar_pic
        avatar_pic: data.avatar_pic || null, 
      },
    });

    notify("Profile created successfully", "success");
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }
}