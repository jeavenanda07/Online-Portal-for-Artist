"use client";

import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/app/components/ui/Modal";
import { useState, useEffect, useRef } from "react";
import CreatePost from "@/app/components/profile/CreatePost";
import formatPostDate from "@/utils/date";
import { notify } from "@/utils/toastHelper";
import Image from "next/image";
import { useParams } from "next/navigation";
import { prisma } from "@/lib/prisma"

interface Comment {
  comment_id: string;
  content: string;
  created_at: Date | string;
  user_profile: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  };
}

const PostSkeleton = () => (
  <div className="w-full max-w-[800px] border border-primary-line bg-primary mx-auto p-4 rounded-2xl animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-6 mt-6" />
    <div className="w-full h-[250px] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
  </div>
);


const PostCard = ({
  details,
  authorProfile, 
  userDetails, 
  isMyAccount,
  onDelete,
  onUpdate,
}: {
  details: any;
  authorProfile: any;
  userDetails: any;
  isMyAccount: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [fetchedComments, setFetchedComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(details.content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!details.post_id) return;
    const fetchCounts = async () => {
      try {
        if (userDetails?.user_profile_id) {
          const likeRes = await fetch(
            `/api/post/like/count?post_id=${details.post_id}&user_profile_id=${userDetails.user_profile_id}`
          );
          const likeData = await likeRes.json();
          setLikeCount(likeData.count ?? 0);
          setLiked(likeData.isLiked ?? false);
        }
        const commRes = await fetch(
          `/api/post/comment?post_id=${details.post_id}`
        );
        const commData = await commRes.json();
        setCommentCount(commData.comments?.length ?? 0);
      } catch {
        /* silent */
      }
    };
    fetchCounts();
  }, [details.post_id, userDetails?.user_profile_id]);

  // Fetch full comments when section opens
  useEffect(() => {
    if (!showComments || fetchedComments) return;
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/post/comment?post_id=${details.post_id}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments ?? []);
          setFetchedComments(true);
        }
      } catch {
        /* silent */
      }
    };
    fetchComments();
  }, [showComments, fetchedComments, details.post_id]);

  const handleLike = async () => {
    if (!userDetails?.user_profile_id) {
      notify("Please log in to like.", "error");
      return;
    }
    setLikeLoading(true);
    try {
      const res = await fetch("/api/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: details.post_id,
          user_profile_id: userDetails.user_profile_id,
        }),
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      notify("Something went wrong.", "error");
    } finally {
      setLikeLoading(false);
    }
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
          post_id: details.post_id,
          user_profile_id: userDetails.user_profile_id,
          content: commentText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        notify("Failed to comment.", "error");
        return;
      }
      setComments((prev) => [...prev, data.comment]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch {
      notify("Something went wrong.", "error");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 mb-4 bg-primary shadow-sm border border-primary-line">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-primary-line">
        <div className="flex items-center gap-3">
          <ProfileIcon username={authorProfile?.username} />
          <div>
            <p className="text-sm font-bold">
              {authorProfile?.full_name ||
                authorProfile?.username ||
                "Anonymous"}
            </p>
            <p className="text-xs opacity-50">
              {formatPostDate(details.date_posted)}
            </p>
          </div>
        </div>

        {/* 3-dot menu — only for post owner */}
        {isMyAccount && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-2 font-bold hover:opacity-50"
            >
              ...
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-background border border-primary-line rounded-xl shadow-xl z-20 p-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left p-2 text-xs hover:bg-green-500/10 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(details.post_id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left p-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-3">
        {isEditing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 bg-secondary border border-primary-line rounded-xl text-sm resize-none outline-none focus:border-green-500/50"
              rows={3}
            />
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-500 px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdate(details.post_id, editText);
                  setIsEditing(false);
                }}
                className="bg-green-600 px-3 py-1 rounded-lg text-xs font-bold text-black"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{details.content}</p>
        )}
      </div>

      {/* Media */}
      {details.media?.length > 0 && (
        <div
          className={`px-5 pb-4 grid gap-2 ${
            details.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {details.media.slice(0, 4).map((url: string, i: number) => (
            <div
              key={url}
              className="relative rounded-xl overflow-hidden aspect-video bg-secondary"
            >
              <Image fill src={url} alt="post media" className="object-cover" />
              {i === 3 && details.media.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center font-black text-white text-lg bg-black/60">
                  +{details.media.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-5 py-3 border-t border-primary-line">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="flex items-center gap-2 text-xs font-bold transition-all"
          style={{ color: liked ? "#ef4444" : "#4b5563" }}
        >
          {liked ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-xs font-bold"
          style={{ color: showComments ? "#4ade80" : "#4b5563" }}
        >
          <AiOutlineMessage size={16} />
          <span>{commentCount} comments</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-5 pb-5 border-t border-primary-line">
          <div className="flex flex-col gap-3 mt-4 max-h-64 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-center py-3 opacity-50">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.comment_id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-line flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                    {c.user_profile?.avatar_pic ? (
                      <Image
                        width={28}
                        height={28}
                        alt="avatar"
                        src={c.user_profile.avatar_pic}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      c.user_profile?.full_name?.[0] || "A"
                    )}
                  </div>
                  <div className="flex-1 bg-secondary rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold">
                        {c.user_profile?.full_name || c.user_profile?.username}
                      </p>
                      <p className="text-[10px] opacity-40">
                        {formatPostDate(c.created_at)}
                      </p>
                    </div>
                    <p className="text-xs">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment();
              }}
              placeholder="Write a comment..."
              maxLength={500}
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-secondary border border-primary-line outline-none"
            />
            <button
              onClick={handleComment}
              disabled={commentLoading || !commentText.trim()}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
              style={
                commentText.trim()
                  ? {
                      background: "linear-gradient(135deg,#16a34a,#22c55e)",
                      color: "#000",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid var(--primary-line)",
                      color: "gray",
                    }
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


const PostPage = () => {
  const { userDetails, loading: userLoading } = useUserData();
  const params = useParams();
  const profileId = (params?.id as string)?.replace(/^@/, "");

  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [postsLoading, setPostsLoading] = useState(true);



  const isMyAccount =
    !!userDetails?.username &&
      userDetails.username.replace(/^@/, "") === profileId;
      useEffect(() => {
        if (!profileId) return;


    const fetchProfileAndPosts = async () => {
      setPostsLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch(`/api/profile/get?username=${profileId}`),
          fetch(`/api/post/get?username=${profileId}`),
        ]);

        const profileData = await profileRes.json();
        const postsData = await postsRes.json();

        setAuthorProfile(profileData.profile ?? null);
        setPosts(postsData.posts ?? []);
      } catch (err) {
        console.error("Failed to load profile/posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [profileId]);

  if (userLoading || postsLoading) {
    return (
      <div className="px-4 py-10 flex flex-col gap-4 items-center">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.post_id !== postId));
        notify("Post deleted", "success");
      }
    } catch {
      notify("Error deleting post", "error");
    }
  };



  const handleUpdatePost = async (postId: string, content: string) => {
    try {
      const res = await fetch("/api/post/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.post_id === postId ? { ...p, content } : p))
        );
        notify("Post updated", "success");
      }
    } catch {
      notify("Error updating post", "error");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 -mt-10">
      <div className="flex flex-col justify-center py-10">
        <div className="flex justify-between items-center w-full max-w-[800px] mb-6 mx-auto text-lg font-semibold">
          <div>
            {isMyAccount
              ? "My Posts"
              : `${authorProfile?.full_name || profileId}'s Posts`}
            <span className="ml-2 text-sm font-normal opacity-50">
              ({posts.length})
            </span>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="w-[90vw] max-w-[30em]"
        >
          <CreatePost onClose={() => setIsOpen(false)} setPosts={setPosts} />
        </Modal>

        <div className="w-full max-w-[800px] mx-auto">
          {/* ✅ Only show create box if it's my account */}
          {isMyAccount && (
            <div
              onClick={() => setIsOpen(true)}
              className="border border-primary-line shadow-sm items-center p-4 flex justify-between bg-primary rounded-2xl gap-4 cursor-pointer mb-6"
            >
              <ProfileIcon username={userDetails?.username} />
              <div className="bg-secondary border border-primary-line rounded-xl w-full py-3 px-4">
                <p className="opacity-60 text-sm">
                  What's on your mind, {userDetails?.username || "Guest"}?
                </p>
              </div>
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-16 opacity-50">
              <p className="font-bold">
                {isMyAccount
                  ? "You haven't posted anything yet."
                  : "No posts yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {posts.map((details) => (
                <PostCard
                  key={details.post_id}
                  details={details}
                  authorProfile={authorProfile}
                  userDetails={userDetails}
                  isMyAccount={isMyAccount}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
