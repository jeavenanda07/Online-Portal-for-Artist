'use server';
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const Authentication = async (email: string, password: string) => {
  try {
    const credentials = await prisma.credentials.findUnique({
      where: { gmail: email },
    });

    if (!credentials) return { status: "no_account" };

    const isMatch = await bcrypt.compare(password, credentials.password);
    if (!isMatch) return { status: "wrong_password" };

    return {
      status: "success",
      email: credentials.gmail,
      role: credentials.role,
    };

  } catch (error) {
    console.error("Authentication error:", error);
    return { status: "error" };
  }
};