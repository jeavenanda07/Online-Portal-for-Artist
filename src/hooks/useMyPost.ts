"use client";

import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";
import { getMyPosts } from "@/app/actions/post";

export function useMyPosts() {
  const { userDetails, loading: userLoading } = useUserData();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      if (userLoading || !userDetails?.user_profile_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMyPosts(userDetails.user_profile_id);
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [userDetails, userLoading]);

  // Return setPosts so it can be updated from other components
  return { posts, setPosts, loading, error };
}