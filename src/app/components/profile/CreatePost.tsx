"use client";

import { useState } from "react";
import { FaImage, FaXmark } from "react-icons/fa6";
import { useUserData } from "@/hooks/useUserData";
import Image from "next/image";
import { uploadMedia } from "@/utils/uploadMedia";
import { notify } from "@/utils/toastHelper";

const CreatePost = () => {
  const [post, setPost] = useState<{
    content: string;
    media: { file: File; preview: string }[];
    visibility: string;
  }>({
    content: "",
    media: [],
    visibility: "public",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userDetails, loading } = useUserData();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setPost((prev) => ({ ...prev, content: e.target.value }));
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const maxAllowed = 10;
    const currentCount = post.media.length;

    if (currentCount + files.length > maxAllowed) {
      setError(`You can only upload a maximum of ${maxAllowed} images.`);
      return;
    }

    setError("");
    const newMedia = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPost((prev) => ({ ...prev, media: [...prev.media, ...newMedia] }));

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    const filtered = post.media.filter((_, i) => i !== index);
    // Revoke the object URL to free memory
    URL.revokeObjectURL(post.media[index].preview);
    setPost((prev) => ({ ...prev, media: filtered }));
    if (filtered.length <= 10) setError("");
  };

  const handlePublish = async () => {
    if (!userDetails?.user_profile_id) {
      notify("Session expired. Please log in again.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload all media files to Supabase Storage
      const uploadedUrls: string[] = [];

      for (const item of post.media) {
        const url = await uploadMedia(item.file, userDetails.user_profile_id);
        if (!url) {
          notify("One or more images failed to upload.", "error");
          setIsSubmitting(false);
          return;
        }
        uploadedUrls.push(url);
      }

      // 2. Create the post in DB
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile_id: userDetails.user_profile_id,
          content: post.content,
          media: uploadedUrls,
          visibility: post.visibility,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify(data.message || "Failed to create post.", "error");
        return;
      }

      // 3. Reset form
      post.media.forEach((item) => URL.revokeObjectURL(item.preview));
      setPost({ content: "", media: [], visibility: "public" });
      notify("Post published!", "success");

    } catch (err) {
      console.error(err);
      notify("Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[500px] mx-auto bg-background rounded-xl shadow-lg p-4 border border-primary-line animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
        </div>
        <hr className="mb-4 opacity-30 border-gray-300 dark:border-gray-700" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-full min-h-[120px] bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
        <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2" />
      </div>
    );
  }

  const isPostEmpty = !post.content && post.media.length === 0;
  const isOverLimit = post.media.length > 10;

  return (
    <div className="max-w-[500px] mx-auto bg-background rounded-xl shadow-lg p-4 border border-primary-line">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold text-center w-full">Create post</h5>
      </div>

      <hr className="mb-4" />

      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
          <Image
            height={40}
            width={40}
            className="w-full h-full object-cover"
            src={userDetails?.avatar_pic || "/avatar_placeholder.png"}
            alt={`${userDetails?.username}_avatar`}
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{userDetails?.full_name}</p>
          <select
            value={post.visibility}
            onChange={(e) => setPost((prev) => ({ ...prev, visibility: e.target.value }))}
            className="text-xs bg-secondary p-1 rounded font-medium cursor-pointer outline-none"
          >
            <option value="public">Public</option>
            <option value="followers">Followers</option>
            <option value="private">Only Me</option>
          </select>
        </div>
      </div>

      {/* Text input */}
      <textarea
        placeholder={`What's on your mind, ${userDetails?.username || "Artist"}?`}
        className="w-full text-lg outline-none resize-none min-h-[120px] bg-transparent"
        value={post.content}
        onChange={handleTextChange}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-xs mb-2 italic">{error}</p>}

      {/* Media previews */}
      {post.media.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {post.media.map((item, index) => (
            <div key={index} className="relative group">
              <img
                src={item.preview}
                className="rounded-lg h-24 w-full object-cover border"
                alt="upload preview"
              />
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black transition"
              >
                <FaXmark size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Media upload row */}
      <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Add to your post</span>
          <span className={`text-[10px] ${post.media.length >= 10 ? "text-red-500 font-bold" : "text-gray-400"}`}>
            {post.media.length} / 10 images
          </span>
        </div>
        <label className={`p-2 rounded-full transition-all ${post.media.length >= 10 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}`}>
          <FaImage className="text-green-500 text-xl" />
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*"
            disabled={post.media.length >= 10}
            onChange={handleMediaUpload}
          />
        </label>
      </div>

      {/* Submit */}
      <button
        disabled={isPostEmpty || isOverLimit || isSubmitting}
        onClick={handlePublish}
        className={`w-full py-2 rounded-lg font-bold transition-all ${
          !isPostEmpty && !isOverLimit && !isSubmitting
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Publishing..." : "Post"}
      </button>

      <p className="text-[10px] text-right mt-2 text-gray-400">
        {post.content.length} / 500
      </p>
    </div>
  );
};

export default CreatePost;