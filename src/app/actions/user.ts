import { prisma } from "@/lib/prisma";

export async function getArtistCredentials() {
  try {
    // Prisma uses lowercase 'credentials' for the method name
    const allUsers = await prisma.credentials.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    console.log("Fetched Credentials:", allUsers);
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

    console.log(`Email check for ${email}:`, credential);
    return !!credential;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}