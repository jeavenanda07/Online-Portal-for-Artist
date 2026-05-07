"use client";

import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/app/components/ui/Modal";
import { useState, useRef, useEffect } from "react";
import CreatePost from "@/app/components/profile/CreatePost";
import { useMyPosts } from "@/hooks/useMyPost";
import formatPostDate from "@/utils/date";
import { notify } from "@/utils/toastHelper";
import Image from "next/image";
import Link from "next/link";

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

// ── Shared Skeleton ───────────────────────────────────────────
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

// ── Unified Post Card Component ───────────────────────────────
const PostCard = ({ 
  details, 
  userDetails, 
  onDelete, 
  onUpdate 
}: { 
  details: any; 
  userDetails: any; 
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

  useEffect(() => {
    if (!details.post_id) return;
    const fetchData = async () => {
      try {
        if (userDetails?.user_profile_id) {
            const likeRes = await fetch(`/api/post/like/count?post_id=${details.post_id}&user_profile_id=${userDetails.user_profile_id}`);
            const likeData = await likeRes.json();
            setLikeCount(likeData.count ?? 0);
            setLiked(likeData.isLiked ?? false);
        }

        const commRes = await fetch(`/api/post/comment?post_id=${details.post_id}`);
        const commData = await commRes.json();
        setCommentCount(commData.comments?.length || 0);
        if (showComments) {
            setComments(commData.comments || []);
            setFetchedComments(true);
        }
      } catch { /* silent */ }
    };
    fetchData();
  }, [details.post_id, userDetails?.user_profile_id, showComments]);

  const handleLike = async () => {
    if (!userDetails?.user_profile_id) { notify("Please log in to like.", "error"); return; }
    setLikeLoading(true);
    try {
      const res = await fetch("/api/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: details.post_id, user_profile_id: userDetails.user_profile_id }),
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch { notify("Something went wrong.", "error"); }
    finally { setLikeLoading(false); }
  };

  const handleComment = async () => {
    if (!userDetails?.user_profile_id) { notify("Please log in to comment.", "error"); return; }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: details.post_id, user_profile_id: userDetails.user_profile_id, content: commentText }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch { notify("Something went wrong.", "error"); }
    finally { setCommentLoading(false); }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 mb-4 bg-primary shadow-sm border-1 border-primary-line"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b-1 border-primary-line">
        <div className="flex items-center gap-3 group">
          <ProfileIcon username={userDetails?.username} />
          <div>
            <p className="text-sm font-bold ">
              {userDetails?.full_name || userDetails?.username || "Anonymous"}
            </p>
            <p className="text-xs">{formatPostDate(details.date_posted)}</p>
          </div>
        </div>
        
        <div className="relative">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className=" hover: px-2 font-bold">...</button>
             {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-background border border-primary-line rounded-xl shadow-xl z-20 p-1">
                    <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="w-full text-left p-2 text-xs  hover:bg-green-500/10 rounded-lg">Edit</button>
                    <button onClick={() => onDelete(details.post_id)} className="w-full text-left p-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg">Delete</button>
                </div>
             )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        {isEditing ? (
          <div className="mt-2">
            <textarea 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 bg-secondary shadow-sm border border-primary-line rounded-xl text-sm  resize-none outline-none focus:border-green-500/50"
                rows={3}
            />
            <div className="flex gap-2 justify-end mt-2">
                <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500">Cancel</button>
                <button onClick={() => { onUpdate(details.post_id, editText); setIsEditing(false); }} className="bg-green-600 px-3 py-1 rounded-lg text-xs font-bold">Save</button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{details.content}</p>
        )}
      </div>

      {/* Media */}
      {details.media?.length > 0 && (
        <div className={`px-5 pb-4 grid gap-2 ${details.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {details.media.slice(0, 2).map((url: string, i: number) => (
            <div key={url} className="relative rounded-xl overflow-hidden aspect-video bg-[#141414]">
              <Image height={620} width={600} src={url} alt="post media" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-5 py-3 border-t-1 border-primary-line" >
        <button onClick={handleLike} disabled={likeLoading} className="flex items-center gap-2 text-xs font-bold" style={{ color: liked ? "#ef4444" : "#4b5563" }}>
          {liked ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
          <span>{likeCount}</span>
        </button>

        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-xs font-bold" style={{ color: showComments ? "#4ade80" : "#4b5563" }}>
          <AiOutlineMessage size={16} />
          <span>{commentCount} comments</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="px-5 pb-5 border-t border-primary-line]">
          <div className="flex flex-col gap-4 mt-4 max-h-64 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.comment_id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a2e1a] flex items-center justify-center text-[10px] text-green-400 font-bold shrink-0">
                    {c.user_profile?.avatar_pic ? <Image width={40} height={40} alt="user_profile" src={c.user_profile.avatar_pic} className="rounded-full w-full h-full object-cover"/> : (c.user_profile?.full_name?.[0] || "A")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold ">{c.user_profile?.full_name}</p>
                    <p className="text-[10px] text-gray-600">{formatPostDate(c.created_at)}</p>
                  </div>
                  <p className="text-xs text-gray-300">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl text-sm bg-secondary shadow-sm border border-primary-line outline-none"
              placeholder="Write a comment..."
            />
            <button onClick={handleComment} disabled={commentLoading || !commentText.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-600 text-black">
              <IoSend size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Post Page ───────────────────────────────────────────
const PostPage = () => {
  const { userDetails, loading } = useUserData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { posts, setPosts, loading: postsLoading } = useMyPosts();

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
    } catch { notify("Error deleting post", "error"); }
  };

  const handleUpdatePost = async (postId: string, content: string) => {
    try {
      const res = await fetch("/api/post/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) => p.post_id === postId ? { ...p, content } : p));
        notify("Post updated", "success");
      }
    } catch { notify("Error updating post", "error"); }
  };

  if (loading || postsLoading) {
    return (
      <div className="px-4 py-10 flex flex-col gap-4 items-center">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 -mt-10">
      <div className="flex flex-col justify-center py-10">
        <div className="flex justify-between items-center w-full max-w-[800px] mb-6 mx-auto text-lg font-semibold ">
          <div>All Posts ({posts.length})</div>
        </div>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-[90vw] max-w-[30em]">
          <CreatePost onClose={() => setIsOpen(false)} setPosts={setPosts} />
        </Modal>

        <div className="w-full max-w-[800px] mx-auto">
          {/* Create Post Trigger */}
          <div
            onClick={() => setIsOpen(true)}
            className="border border-primary-line shadow-sm items-center p-4 flex justify-between bg-primary rounded-2xl gap-4 cursor-pointer mb-6"
          >
            <ProfileIcon username={userDetails?.username} />
            <div className="bg-secondary border border-primary-line rounded-xl w-full py-3 px-4">
              <p className="opacity-60 text-sm">What's on your mind, {userDetails?.username || "Guest"}?</p>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="flex flex-col w-full">
            {posts?.map((details) => (
              <PostCard 
                key={details.post_id} 
                details={details} 
                userDetails={userDetails} 
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;