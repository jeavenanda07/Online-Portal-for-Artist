"use client";

import Link from "next/link";
import { getUserInfo } from "@/app/actions/user";
import { useEffect, useState } from "react";

interface Props {
  username?: string | undefined;
  email?: string | undefined;
}

const ProfileIcon = ({ username, email }: Props) => {
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Avoid calling the action if there is no username
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserInfo(username);
        // Assuming your user data object contains the avatar_pic field
        setProfile(data?.avatar_pic || "/avatar_placeholder.png");
        console.log("hello", data)
      } catch (error) {
        setProfile("/avatar_placeholder.png");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <Link
      href={`/profile/${username || ""}`}
      className="block h-11 w-11 bg-primary rounded-full text-left"
    >
      <div className="h-full w-full rounded-full">
        {loading ? (
          <div className="h-full w-full bg-zinc-800 animate-pulse rounded-full" />
        ) : (
          <img
            className="object-cover h-full w-full rounded-full border-2 border-primary-line"
            src={profile || "/avatar_placeholder.png"}
            alt="User profile"
          />
        )}
      </div>
    </Link>
  );
};

export default ProfileIcon;