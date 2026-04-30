"use server";

import { cookies } from "next/headers";

/**
 * CREATE: Sets the initial session cookie
 */
export async function createSession(user: { email: string; role: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionData = JSON.stringify(user);

  const cookieStore = await cookies();

  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * READ: Retrieves and parses the session cookie
 */

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  console.log("Session cookie value:", session); // Debug log to check cookie value
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}


export async function updateSession(newData: Partial<{ email: string; role: string }>) {
  const cookieStore = await cookies();
  const currentSession = await getSession();

  if (!currentSession) return null;

  // Merge old data with new data
  const updatedUser = { ...currentSession, ...newData };
  
  // Re-run the create logic to overwrite the cookie with the new data
  await createSession(updatedUser);
  
  return updatedUser;
}

/**
 * DELETE: Removes the session cookie (Logout)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}