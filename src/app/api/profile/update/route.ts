import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_profile_id,
      full_name,
      username,
      contact,
      about_me,
      specialization,
      display_location,
      social_links,
      gender,
      birthdate,
    } = body;

    if (!user_profile_id) {
      return NextResponse.json({ message: "user_profile_id is required." }, { status: 400 });
    }

    // Check username uniqueness if changed
    const existing = await prisma.userProfile.findFirst({
      where: {
        username,
        NOT: { user_profile_id },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Username is already taken." }, { status: 409 });
    }

    const updated = await prisma.userProfile.update({
      where: { user_profile_id },
      data: {
        full_name,
        username,
        contact,
        about_me,
        specialization,
        display_location,
        social_links,
        gender,
        birthdate: birthdate ? new Date(birthdate) : undefined,
      },
    });

    return NextResponse.json({ profile: updated }, { status: 200 });

  } catch (err: any) {
    console.error("Update profile error:", err.message);
    return NextResponse.json({ message: err.message || "Failed to update profile." }, { status: 500 });
  }
}