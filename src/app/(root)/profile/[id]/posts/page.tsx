"use client";

import { AiOutlineMessage } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/app/components/ui/Modal";
import { useState, useRef, useEffect } from "react";
import CreatePost from "@/app/components/profile/CreatePost";
import { useMyPosts } from "@/hooks/useMyPost";
import formatPostDate from "@/utils/date";
import { notify } from "@/utils/toastHelper";
import { useRouter } from "next/navigation";

const PostSkeleton = () => {
  return (
    <div className="w-full max-w-[800px] border border-primary-line bg-primary mx-auto p-4 rounded-md animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="h-6 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-6 mt-6" />
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] bg-gray-200 dark:bg-gray-800 rounded-sm mb-4" />
      <div className="flex gap-8 items-center mt-3">
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

const PostPage = () => {
  const { userDetails, loading } = useUserData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { posts, setPosts, loading: postsLoading, error } = useMyPosts();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) return alert("Failed to delete post.");

      setPosts((prev) => prev.filter((p) => p.post_id !== postId));
      const isMatch = posts.map(prev => console.log("prev", prev));
      isMatch;
      setActiveMenuId(null);

      setTimeout(() => {
        notify("Post deleted successfully", "success");
      }, 100)


    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (postId: string) => {
    try {
      const res = await fetch("/api/post/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: editText,
        }),
      });
  
      if (!res.ok) return alert("Failed to update post.");
  
      const { post: updatedPost } = await res.json();
  
      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId ? { ...p, content: updatedPost.content } : p
        )
      );
  
      setEditPostId(null);
      notify("Post updated successfully", "success");
  
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || postsLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="flex flex-col justify-center py-10">
          <div className="flex justify-between items-center w-full max-w-[800px] mb-4 mx-auto text-lg font-semibold opacity-40 animate-pulse">
            <div className="h-7 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-7 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-full max-w-[800px] mx-auto flex flex-col gap-4">
            <PostSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 -mt-10">
      <div className="flex flex-col justify-center py-10">
        <div className="flex justify-between items-center w-full max-w-[800px] mb-6 mx-auto text-lg font-semibold">
          <div>All Post {posts.length}</div>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="w-[90vw] max-w-[30em] h-[20em]"
        >
          <CreatePost onClose={() => setIsOpen(false)} setPosts={setPosts} />
        </Modal>

        <div className="w-full max-w-[800px] mx-auto">
          <div
            onClick={() => setIsOpen(true)}
            className="border border-primary-line items-center p-4 flex justify-between bg-primary rounded-md gap-4"
          >
            <div className="flex shrink-0">
              <ProfileIcon username={userDetails?.username} />
            </div>
            <div className="border border-primary-line rounded-md bg-primary w-full py-3 sm:py-4 px-4 cursor-pointer hover:brightness-110 transition-all">
              <p className="text-gray-400 text-sm sm:text-base truncate">
                What's on your mind, {userDetails?.username || "Guest"}?
              </p>
            </div>
          </div>

          <br />

          <div className="flex flex-col gap-4 w-full" ref={menuRef}>
            {posts?.map((details) => {
              return (
                <div
                  key={details.post_id}
                  className="border w-full border-primary-line bg-primary mx-auto p-4 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <ProfileIcon username={userDetails?.username} />
                      <div>
                        <p className="font-bold text-sm sm:text-base">
                          {userDetails?.full_name || "Anonymous"}
                        </p>
                        <p className="text-xs sm:text-sm opacity-50">
                          {formatPostDate(details?.date_posted)}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === details.post_id ? null : details.post_id
                          )
                        }
                        className="hover:opacity-50 cursor-pointer text-xl -translate-y-2 sm:-translate-y-4 px-2 font-bold"
                      >
                        ...
                      </button>

                      {activeMenuId === details.post_id && (
                        <div className="absolute right-0 mt-2 w-36 bg-secondary border border-primary-line rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                          <button
                            onClick={() => {
                              setEditPostId(details.post_id);
                              setEditText(details.content);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(details.post_id)} 
                            className="w-full text-left p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editPostId === details.post_id ? (
                    <div className="mt-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border border-primary-line rounded bg-secondary text-sm sm:text-base resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => setEditPostId(null)}
                          className="px-3 py-1 text-xs sm:text-sm border border-primary-line rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleUpdatePost(details.post_id);
                          }}
                          className="px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h6 className="mt-4 sm:mt-6 mb-2 text-sm sm:text-base">
                      {details?.content}
                    </h6>
                  )}

                  {details.media && details.media.length > 0 && (
                    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] bg-secondary rounded-sm overflow-hidden mt-3 group">
                      <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
                        {details.media.map(
                          (mediaUrl: string, index: number) => (
                            <a
                              key={index}
                              href={`/photo/${details.post_id}`}
                              className="flex shrink-0 w-full h-full snap-center relative cursor-pointer"
                            >
                              <img
                                src={mediaUrl}
                                alt={`Feed content ${index + 1}`}
                                className="w-full h-full object-contain bg-black/5"
                              />
                            </a>
                          )
                        )}
                      </div>

                      {details.media.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                          {details.media.map((_: any, index: number) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full ${
                                index === 0 ? "bg-white" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-8 items-center mt-3 text-sm sm:text-base">
                    <div className="flex gap-2 items-center cursor-pointer hover:text-red-500 transition-colors">
                      <TiHeartOutline size={22} />
                      <p>10</p>
                    </div>
                    <div className="flex gap-2 items-center cursor-pointer hover:opacity-70">
                      <AiOutlineMessage size={20} />
                      <p>Comments</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;