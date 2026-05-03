"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { createSession } from "@/app/actions/auth";
import { notify } from "@/utils/toastHelper";
import { checkEmailExists } from "@/app/actions/user";
import { getUserInfo } from "@/app/actions/user";

const CheckSignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
  
        if (!user || !user.email) {
          notify("Session expired", "error");
          router.push("/login");
          return;
        }
        
        const res = await fetch(`/api/auth/check-email?email=${user.email}`);
        const data = await res.json();

        if (data.exists) {
          const userInfo = await getUserInfo(undefined, user?.user_metadata.email);
          console.log("userInfo", userInfo)

          await createSession({
            email: userInfo?.credentials.gmail || "",
            username: userInfo?.username,
            role: "User",
          });
  
          router.push("/");
          
          setTimeout(() => {
            const displayName = userInfo?.full_name || userInfo?.username || "User";
            notify(`Welcome back ${displayName}`, "success");
          }, 1500);
        } else {
          router.push("/register/profile-setup");
          notify("Please complete your profile setup", "info");
        }
      } catch (error) {
        console.error(error);
        notify("Something went wrong", "error");
      } 
    };
  
    checkUser();
  }, []);
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Checking your account...</h1>
        <p className="text-sm opacity-60 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default CheckSignInPage;