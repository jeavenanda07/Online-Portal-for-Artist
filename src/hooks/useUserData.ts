"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/app/actions/auth"; 
import { getUserInfo } from "@/app/actions/user";

export const useUserData = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const session = await getSession();
        
        // Safely extract the username based on your auth implementation
        const username = session?.user?.username || session?.username;
        
        if (username) {
          const details = await getUserInfo(username, undefined);
          setUserDetails(details);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return { userDetails, loading };
};