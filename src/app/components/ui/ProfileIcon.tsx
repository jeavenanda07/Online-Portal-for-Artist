"use client";

import Link from "next/link";
import { getUserInfo } from "@/app/actions/user";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  username?: string | undefined;
  email?: string | undefined;
}

const ProfileIcon = ({ username, email }: Props) => {
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserInfo(username);
        setProfile(data?.avatar_pic || "/avatar_placeholder.png");
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
      href={`/profile/${username?.replace("@", "") || ""}`}
      className="block h-11 w-11 bg-primary rounded-full text-left"
    >
      <div className="h-full w-full rounded-full">
        {loading ? (
          <div className="h-full w-full bg-zinc-800 animate-pulse rounded-full" />
        ) : (
          <Image
            width={30}
            height={30}
            className="object-cover h-full w-full rounded-full border-2 border-primary-line"
            src={profile || "/avatar_placeholder.png"}
            alt={`user_profile`}
          />
        )}
      </div>
    </Link>
  );
};

export default ProfileIcon;