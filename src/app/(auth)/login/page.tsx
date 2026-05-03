"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import Logo from "@/app/components/ui/Logo";
import { validateUser } from "@/utils/validator";
import { notify } from "@/utils/toastHelper";
import { Authentication } from "@/app/modules/Authentication";
import { getCredentials, seedCredentials } from "@/lib/actions/credentials";
import { createSession, getSession } from "@/app/actions/auth"; // Added getSession
import { setData } from "@/utils/storage";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Loading state for auth check
  const router = useRouter();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          // Redirect based on role
          if (session.role === "Admin") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          setIsCheckingAuth(false); // No session, show the login form
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsCheckingAuth(false);
      }
    };

    checkExistingSession();
    
    // Log system readiness
    getCredentials()
      .then(() => console.log("System Ready"))
      .catch(error => console.error("Initialization Error:", error));
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login/check-signin`, 
      },
    });

    if (error) {
      notify(error.message, "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const validated = validateUser(email, password);
    if (validated.length !== 0) {
      notify(validated.join(", "), "error");
      setIsPending(false);
      return;
    }

    try {
      const authUser = await Authentication(email.trim(), password.trim());

      if (!authUser) {
        notify("Invalid email or password", "error");
        setIsPending(false);
        return;
      }

      const role = authUser.role.toLowerCase();
      const getSessionData = await getSession(); // Get current session data
      console.log("Current Session Data:", getSessionData); // Log session data for debugging

      if (role === "admin") {
        await createSession({ email: authUser.email,  role: "Admin" });
        notify("Welcome back, Administrator", "success");
        router.push("/dashboard");
      } else if (role === "user") {
        await createSession({ email: authUser.email,  role: "User" });
        setData("token", true); 
        notify("Login successful!", "success");
        router.push("/");
      } else {
        notify("Account role not recognized", "error");
      }
    } catch (error) {
      notify("An error occurred during login", "error");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };


  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background"> 
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen flex flex-col justify-center items-center bg-[url('https://static.vecteezy.com/system/resources/previews/006/595/713/non_2x/silhouettes-of-panoramic-mountains-view-landscape-vector.jpg')] bg-cover bg-center px-4">
      
      <div className="absolute top-12 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 z-30">
        <Logo />
      </div>

      <div className="z-20 flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* LEFT PANEL */}
        <div 
          className="hidden md:flex flex-col justify-center w-1/2 bg-cover p-12 text-white bg-black/40 backdrop-brightness-75" 
          style={{ backgroundImage: "url('/form-background.jpg')" }}
        >
          <h1 className="text-5xl font-bold leading-tight uppercase">
            Join the <br /> Future of <br /> Art & <br /> Creativity
          </h1>
          <p className="mt-8 text-lg opacity-90 leading-relaxed">
            Showcase your talent, connect with fellow artists, and open doors to opportunities. 
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-center text-black mb-2">Welcome back</h3>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-zinc-200 p-4 text-black rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
            >
              <FcGoogle className="text-2xl" />
              <p className="font-semibold">Continue with Google</p>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-grow h-px bg-zinc-200"></div>
              <span className="text-zinc-400 text-sm uppercase font-bold tracking-tighter">or</span>
              <div className="flex-grow h-px bg-zinc-200"></div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <TfiEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400" />
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-zinc-200 p-4 pl-12 rounded-xl text-black outline-none transition-all"
                  type="email"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <CiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-zinc-400" />
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-zinc-200 p-4 pl-12 rounded-xl text-black outline-none transition-all"
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              disabled={isPending}
              type="submit"
              className={`w-full p-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                isPending ? 'bg-zinc-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-zinc-600 text-sm">
              Don't have an account?{" "}
              <Link className="text-blue-600 font-bold hover:underline" href="/register">
                Create an account
              </Link>
            </p>

            <button 
              type="button"
              className="mt-4 text-[10px] text-zinc-300 uppercase tracking-widest hover:text-zinc-500"
              onClick={async () => {
                await seedCredentials();
                notify("Data Seeded!", "success");
              }}
            >
              Sync System Database
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}