"use server"
import { prisma } from "@/lib/prisma"

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { username }
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}