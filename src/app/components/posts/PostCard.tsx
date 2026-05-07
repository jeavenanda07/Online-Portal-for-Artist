"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import formatPostDate from "@/utils/date";
import { useUserData } from "@/hooks/useUserData";
import { notify } from "@/utils/toastHelper";

interface Comment {
  comment_id: string;
  content: string;
  created_at: Date | string; // 👈 accept both
  user_profile: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  };
}

interface PostCardProps {
  post: any;
  initialLikeCount: number;
  initialCommentCount: number;
  initialIsLiked: boolean;
  initialComments: Comment[];
}

export const PostCard = ({
  post,
  initialLikeCount,
  initialCommentCount,
  initialIsLiked,
  initialComments,
}: PostCardProps) => {
  const { userDetails } = useUserData();
  const author = post.author;

  const [liked, setLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    if (!userDetails?.user_profile_id) {
      notify("Please log in to like posts.", "error");
      return;
    }

    setLikeLoading(true);
    try {
      const res = await fetch("/api/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          user_profile_id: userDetails.user_profile_id,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) { notify("Failed to like post.", "error"); return; }
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch { notify("Something went wrong.", "error"); }
    finally { setLikeLoading(false); }
  };

  const handleComment = async () => {
    if (!userDetails?.user_profile_id) {
      notify("Please log in to comment.", "error");
      return;
    }
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          user_profile_id: userDetails.user_profile_id,
          content: commentText,
        }),
      });
      const data = await res.json();
      if (!res.ok) { notify("Failed to post comment.", "error"); return; }
      setComments((prev) => [...prev, data.comment]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch { notify("Something went wrong.", "error"); }
    finally { setCommentLoading(false); }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a2e1a")}
    >
      {/* Author header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link href={`/profile/${author?.username?.replace(/^@/, "")}`} className="flex items-center gap-3 group">
          {author?.avatar_pic ? (
            <Image src={author.avatar_pic} alt={author.full_name || author.username}
              width={40} height={40} className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
              style={{ background: "#1a2e1a", color: "#4ade80" }}>
              {author?.full_name?.[0] || "A"}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">
              {author?.full_name || author?.username}
            </p>
            <p className="text-xs" style={{ color: "#4b5563" }}>{formatPostDate(post.date_posted)}</p>
          </div>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(34,197,94,0.07)", color: "#4b5563", border: "1px solid #1a2e1a" }}>
          {post.visibility}
        </span>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-5 pb-3 text-sm leading-relaxed" style={{ color: "#e5e7eb" }}>
          {post.content}
        </p>
      )}

      {/* Media */}
      {post.media?.length > 0 && (
        <div className={`px-5 pb-4 grid gap-2 ${
          post.media.length === 1 ? "grid-cols-1" :
          post.media.length === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}>
          {post.media.slice(0, 3).map((url: string, i: number) => (
            <div key={i} className="relative rounded-xl overflow-hidden"
              style={{ aspectRatio: post.media.length === 1 ? "16/9" : "1/1" }}>
              <Image src={url} alt={`media ${i + 1}`} fill className="object-cover" />
              {i === 2 && post.media.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center font-black text-white text-lg"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  +{post.media.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-5 py-3" style={{ borderTop: "1px solid #1a2e1a" }}>
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="flex items-center gap-2 text-xs font-bold transition-all"
          style={{ color: liked ? "#ef4444" : "#4b5563" }}
        >
          {liked
            ? <FaHeart size={15} className="text-red-400" />
            : <FaRegHeart size={15} />
          }
          <span>{likeCount}</span>
        </button>

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments((p) => !p)}
          className="flex items-center gap-2 text-xs font-bold transition-colors"
          style={{ color: showComments ? "#4ade80" : "#4b5563" }}
        >
          <AiOutlineMessage size={16} />
          <span>{commentCount} {commentCount === 1 ? "comment" : "comments"}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid #1a2e1a" }}>

          {/* Existing comments */}
          <div className="flex flex-col gap-4 mt-4 max-h-64 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "#4b5563" }}>
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.comment_id} className="flex gap-3">
                  {c.user_profile?.avatar_pic ? (
                    <Image src={c.user_profile.avatar_pic} alt={c.user_profile.username}
                      width={32} height={32} className="rounded-full object-cover shrink-0"
                      style={{ width: 32, height: 32 }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0"
                      style={{ background: "#1a2e1a", color: "#4ade80" }}>
                      {c.user_profile?.full_name?.[0] || "A"}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-white">
                        {c.user_profile?.full_name || c.user_profile?.username}
                      </p>
                      <p className="text-[10px]" style={{ color: "#4b5563" }}>
                        {formatPostDate(c.created_at)}
                      </p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#e5e7eb" }}>
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleComment(); }}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "#141414", border: "1px solid #1a2e1a" }}
              maxLength={500}
            />
            <button
              onClick={handleComment}
              disabled={commentLoading || !commentText.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={
                commentText.trim()
                  ? { background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#000" }
                  : { background: "#1a2e1a", color: "#4b5563", cursor: "not-allowed" }
              }
            >
              <IoSend size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};