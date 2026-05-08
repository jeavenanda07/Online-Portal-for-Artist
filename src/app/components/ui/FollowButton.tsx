"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  myId: string;
}

const FollowButton = ({ targetUserId, myId }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/api/follow?targetUserId=${targetUserId}&myId=${myId}`);
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [targetUserId, myId]);

  const handleFollow = async () => {
    setPending(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      setIsFollowing(data.following);
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-10 w-28 rounded-xl bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={pending}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest
        transition-all duration-200 active:scale-95 disabled:opacity-60
        ${isFollowing
          ? hovered
            ? "bg-red-500/10 border border-red-500/40 text-red-400"
            : "bg-[#00d26a]/10 border border-[#00d26a]/30 text-[#00d26a]"
          : "bg-[#00d26a] text-black hover:bg-[#00b85a] border border-transparent"
        }
      `}
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isFollowing ? (
        <>
          {hovered ? (
            <>
              <UserCheck size={14} />
              <span>Unfollow</span>
            </>
          ) : (
            <>
              <UserCheck size={14} />
              <span>Following</span>
            </>
          )}
        </>
      ) : (
        <>
          <UserPlus size={14} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default FollowButton;