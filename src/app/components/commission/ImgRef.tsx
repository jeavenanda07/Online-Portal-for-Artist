"use client";

import { useState } from "react";
import { TbFolderUp } from "react-icons/tb";
import { MdImage } from "react-icons/md";
import { Loader2, X } from "lucide-react";
import { notify } from "@/utils/toastHelper";

interface ImgRefProps {
  images: { file: File; url: string }[];
  setImages: React.Dispatch<React.SetStateAction<{ file: File; url: string }[]>>;
  goNext: () => void;
  func: (value: boolean) => void;
  onUploadComplete: (urls: string[]) => void; // ✅ new — passes supabase URLs up
}

const ImgRef = ({ images, setImages, goNext, func, onUploadComplete }: ImgRefProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (images.length >= 3) {
        notify("Maximum 3 images allowed", "error");
        return;
      }

      if (!file.type.startsWith("image/")) {
        notify("Only image files are allowed", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        notify("File size must be under 5MB", "error");
        return;
      }

      const duplicate = images.some(
        (img) => img.file.name === file.name && img.file.size === file.size
      );

      if (duplicate) {
        notify("This image is already added", "error");
        return;
      }

      setImages((prev) => [
        ...prev,
        { file, url: URL.createObjectURL(file) },
      ]);
    }

    // Reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      // Revoke blob URL to free memory
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (images.length >= 3) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      setImages((prev) => [
        ...prev,
        { file, url: URL.createObjectURL(file) },
      ]);
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      notify("Select at least 1 image to continue", "error");
      return;
    }

    setUploading(true);

    try {
      // ✅ Upload all images to Supabase storage
      const formData = new FormData();
      images.forEach((img) => formData.append("files", img.file));

      const res = await fetch("/api/commission/upload-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        notify(data.error ?? "Upload failed", "error");
        return;
      }

      // ✅ Pass the real Supabase public URLs up to CommissionForm
      onUploadComplete(data.urls);
      goNext();

    } catch (err) {
      console.error(err);
      notify("Something went wrong during upload", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-secondary rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h4 className="font-black text-2xl text-white">Upload Reference Images</h4>
      <p className="text-sm text-zinc-500 mt-2">
        Provide visual references to guide the artist. Max 3 images, 5MB each.
      </p>

      <form onSubmit={handleSubmitForm} className="mt-6">

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border-2 border-dashed border-white/10 hover:border-[#00d26a]/40 transition-colors rounded-2xl bg-white/5 cursor-pointer group"
        >
          <label
            htmlFor="img-reference"
            className="flex flex-col items-center justify-center py-10 cursor-pointer w-full"
          >
            <TbFolderUp className="text-6xl text-zinc-600 group-hover:text-[#00d26a] transition-colors mb-3" />
            <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP — max 5MB</p>
          </label>
          <input
            className="hidden"
            id="img-reference"
            name="img-reference"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>

        {/* Preview slots */}
        <div className="flex gap-3 mt-5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="relative flex-1 aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center group"
            >
              {images[index] ? (
                <>
                  <img
                    src={images[index].url}
                    alt={`reference ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Remove button */}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                  {/* Index badge */}
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                    {index + 1}
                  </span>
                </>
              ) : (
                <MdImage className="text-3xl text-zinc-700" />
              )}
            </div>
          ))}
        </div>

        <p className="text-[10px] text-zinc-600 mt-2 font-medium">
          {images.length}/3 images selected
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => func(false)}
            disabled={uploading}
            className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-white/5 transition-all disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading || images.length === 0}
            className="flex-1 py-3 rounded-xl bg-[#00d26a] hover:bg-[#00b85a] text-black text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Next Step"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImgRef;