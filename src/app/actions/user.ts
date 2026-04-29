import { prisma } from "@/lib/prisma";

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