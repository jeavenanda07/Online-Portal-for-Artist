// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.credentials.create({
      data: {
        gmail: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created." }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Registration failed." }, { status: 500 });
  }
}