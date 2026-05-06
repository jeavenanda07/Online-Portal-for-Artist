"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed

export async function getMyPosts(userProfileId: string | undefined) {
  if (!userProfileId) {
    throw new Error("User Profile ID is required");
  }

  try {
    const posts = await prisma.post.findMany({
        where: {user_profile_id: userProfileId},
        orderBy: {
            date_posted: 'desc',
          },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
}