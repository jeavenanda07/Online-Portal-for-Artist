import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Replace the whole getArtwork function with this
export async function getArtwork(id: string) {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { artwork_id: id },
        include: {
          user_profile: {
            select: {
              user_profile_id: true,
              full_name: true,
              username: true,
              avatar_pic: true,
            },
          },
        },
      });
      return artwork;
    } catch (err) {
      console.error("getArtwork error:", err);
      return null;
    }
  }