// @/app/actions/auth.ts
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient"; // Adjust path if needed

/**
 * CREATE: Sets the initial session cookie
 */
export async function createSession(user: { email: string; username?: string; role: string }) {
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
  
  if (!session) return null;
  
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

/**
 * UPDATE: Merges session data
 */
export async function updateSession(newData: Partial<{ email: string; role: string }>) {
  const currentSession = await getSession();

  if (!currentSession) return null;

  const updatedUser = { ...currentSession, ...newData };
  await createSession(updatedUser);
  
  return updatedUser;
}


export async function deleteSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  await supabase.auth.signOut();
  cookieStore.delete("session");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Authenticate using Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid credentials" };
  }

  // 2. Set your custom session cookie on success
  await createSession({
    email: data.user.email!,
    username: data.user.user_metadata?.full_name ? `@${data.user.user_metadata.full_name.replace(/\s+/g, '_').toLowerCase()}` : "",
    role: data.user.app_metadata?.role || "user", // Or whatever custom metadata you track
  });

  return { success: true };
}