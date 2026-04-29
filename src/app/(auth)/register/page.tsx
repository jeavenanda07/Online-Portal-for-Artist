"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";

import Logo from "@/app/components/ui/Logo";
import { supabase } from "@/lib/supabaseClient";
import { getSession } from "@/app/actions/auth";
import { notify } from "@/utils/toastHelper";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
          setIsCheckingAuth(false); // No session, show the registration form
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsCheckingAuth(false);
      }
    };

    checkExistingSession();
  }, [router]);

  // Google sign-up handler
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/register/profile-setup`, 
      },
    });

    if (error) {
      notify(error.message, "error");
    }
  };

  // Email + password sign-up handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    console.log("Attempting signup for:", email);
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This ensures that after they click the email link, 
        // they eventually land back where you want them.
        emailRedirectTo: `${window.location.origin}/register/profile-setup`,
      }
    });
  
    if (error) {
      console.error("Supabase Error:", error.message);
      notify(`Signup Failed: ${error.message}`, "error");
    } else {
      console.log("Supabase Response Data:", data);
      
      // Check if the user already exists
      if (data.user?.identities?.length === 0) {
        notify("This email is already registered! Try logging in instead.", "error");
      } else if (data.user) {
        // ✅ SUCCESS CONDITION: New user created
        notify("Account created! Please check your email to confirm.", "success");
        router.push("/register/profile-setup");
      }
    }
    setIsPending(false);
  };


  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="relative shadow-xl min-h-[100dvh] w-[100vw] border-white border-2 shadow-white flex flex-col justify-center items-center h-[100dvh] bg-[url('https://static.vecteezy.com/system/resources/previews/006/595/713/non_2x/silhouettes-of-panoramic-mountains-view-landscape-vector.jpg')] bg-cover bg-center">
      <div className="z-20 flex justify-center h-[40em] rounded-md overflow-hidden">
        <div
          className="hidden md:block w-1/2 bg-cover p-8 pt-24 leading-6 text-white"
          style={{ backgroundImage: `url(form-background.jpg)` }}
        >
          <h1 className="text-5xl text-start font-bold leading-[1.2em]">
            JOIN THE <br />
            FUTURE OF <br /> ART & <br />
            CREATIVITY
          </h1>
          <p className="text-lg text-start mt-8 leading-[2em] pr-8">
            Showcase your talent, connect with fellow artists, and open doors to
            opportunities. Whether you're a traditional or digital artist, share
            your work, gain appreciation, and build meaningful collaboration.
          </p>
        </div>

        <div className="w-[95dvw] md:w-1/2 bg-white py-10">
          <form onSubmit={handleSignup} className="grid gap-5 p-10">
            <h3 className="text-3xl font-bold text-center text-black">
              Create an account
            </h3>

            {/* Google Sign-up */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleGoogleSignup}
              className="border border-cyan-500 p-5 text-black rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
            >
              <FcGoogle className="text-xl" />
              <p>Sign up with Google</p>
            </button>

            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-cyan-500"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow h-px bg-cyan-500"></div>
            </div>

            {/* Email + Password Sign-up */}
            <div className="relative w-full">
              <TfiEmail className="absolute left-4 top-6 text-2xl text-gray-500" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex border border-cyan-500 p-5 pl-14 w-full rounded-lg text-black outline-none focus:border-blue-500 transition-all"
                type="email"
                placeholder="Email"
              />
            </div>

            <div className="relative w-full">
              <CiLock className="absolute left-4 top-6 text-2xl text-gray-700" />
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex border border-cyan-500 p-5 pl-14 w-full rounded-lg text-black outline-none focus:border-blue-500 transition-all"
                type="password"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <input required type="checkbox" id="terms" className="accent-cyan-500" />
                <label className="text-black text-sm" htmlFor="terms">
                  I agree to the
                </label>
                <a className="text-blue-600 text-sm hover:underline" href="#">
                  Terms & Conditions
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`border p-5 rounded-xl text-white font-bold transition-all shadow-md ${
                isPending ? 'bg-zinc-400' : 'bg-blue-500 hover:bg-blue-600 active:scale-[0.98]'
              }`}
            >
              {isPending ? "Creating Account..." : "Sign up"}
            </button>

            <p className="text-center text-black">
              Already have an account?{" "}
              <Link className="text-blue-600 font-bold hover:underline" href="/login">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-12 md:left-22 text-white md:block">
        <Logo />
      </div>
    </div>
  );
}