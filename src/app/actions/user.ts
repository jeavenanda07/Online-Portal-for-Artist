"use server"

import { prisma } from "@/lib/prisma";
import { getSession } from "./auth";

export async function getArtistCredentials() {
  try {
    // Prisma uses lowercase 'credentials' for the method name
    const allUsers = await prisma.credentials.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return allUsers;
  } catch (error) {
    console.error("Failed to fetch credentials:", error);
    return [];
  }
}

export async function checkEmailExists(email: string) {
  try {
    const credential = await prisma.credentials.findFirst({
      where: {
        gmail: email,
      },
    });

    return !!credential;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

export async function getUserInfo(username?: string, gmail?: string) {
  try {
    let whereClause: any = {};

    if (username && gmail) {
      whereClause.OR = [
        { username },
        { 
          credentials: { 
            gmail: gmail 
          } 
        },
      ];
    } else if (username) {
      whereClause.username = username;
    } else if (gmail) {
      whereClause.credentials = {
        gmail: gmail,
      };
    } else {
      return null; 
    }

    const user = await prisma.userProfile.findFirst({
      where: whereClause,
      include: {
        credentials: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}