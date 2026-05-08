"use client";

import { useState } from "react";
import Modal from "../../ui/Modal";
import { TbFolderPlus, TbCloudUpload } from "react-icons/tb";
import Image from "next/image";
import { notify } from "@/utils/toastHelper";
import { CreateGalleryData } from "@/types/gallery";
import { IoMdClose } from "react-icons/io";
import { Globe, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUserData } from "@/hooks/useUserData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const CreateGalleryModal = ({
  isOpen,
  onClose,
  onCreate,
}: Props) => {

  const { userDetails } = useUserData();

  const [form, setForm] = useState<CreateGalleryData>({
    title: "",
    description: "",
    visibility: "public",
    coverImageFile: undefined,
    coverImagePreview: undefined,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleCoverImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return notify("Max 5MB allowed", "error");
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      coverImageFile: file,
      coverImagePreview: previewUrl,
    }));
  };

  const handleClose = () => {
    setForm({
      title: "",
      description: "",
      visibility: "public",
      coverImageFile: undefined,
      coverImagePreview: undefined,
    });

    onClose();
  };

  const handleCreate = async () => {
    try {

      if (!form.title.trim()) {
        return notify("Collection title is required", "error");
      }

      setIsUploading(true);

      let coverImageUrl = "";
      if (form.coverImageFile) {
        const fileExt =
          form.coverImageFile.name.split(".").pop();
        const fileName =
          `${crypto.randomUUID()}.${fileExt}`;
        const filePath =
          `gallery-covers/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("gallery_cover_photo")
            .upload(filePath, form.coverImageFile);

        if (uploadError) {
          setIsUploading(false);
          return notify(uploadError.message, "error");
        }

        const { data } = supabase.storage
          .from("gallery_cover_photo")
          .getPublicUrl(filePath);

        coverImageUrl = data.publicUrl;
      }

      if (!userDetails?.user_profile_id) {
        setIsUploading(false);
        return notify("User not loaded", "error");
      }

      const res = await fetch("/api/gallery/create", {
        method: "POST",
        body: JSON.stringify({
          user_profile_id: userDetails?.user_profile_id,
          title: form.title,
          description: form.description,
          visibility: form.visibility,
          cover_image: coverImageUrl,
        }),
      });

      console.log("res", form)
      if (!res.ok) {
        setIsUploading(false);

        return notify(
          "Failed to create collection",
          "error"
        );
      }

      const gallery = await res.json();
      console.log("gallery", gallery)

      notify(
        "Collection created successfully",
        "success"
      );

      onCreate(gallery);

      handleClose();

    } catch (error) {
      console.error(error);

      notify("Something went wrong", "error");

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[800px] w-[95vw] bg-primary border border-primary-line rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      {/* HEADER */}
      <div className="flex bg-secondary justify-between items-center px-8 py-6 border-b border-primary-line">
        <div className="flex items-center gap-3">
          <div>
            <TbFolderPlus size={24} />
          </div>

          <div>
            <h2 className="font-bold text-xl tracking-tight">
              New Collection
            </h2>

            <p className="text-[10px] uppercase tracking-widest font-black">
              Studio Workspace / Creator
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2 rounded-full transition-all"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="md:flex gap-0 h-full">

        {/* LEFT */}
        <div className="md:w-[320px] p-8 border-r border-white/5">

          <label className="block text-[10px] font-black uppercase tracking-widest mb-4">
            Collection Cover
          </label>

          <div className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border-2 border-dashed border-white/10 hover:border-[#00d26a]/40 transition-all cursor-pointer">

            {form.coverImagePreview ? (
              <>
                <Image
                  fill
                  src={form.coverImagePreview}
                  alt="Preview"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center bg-black/50">
                  <TbCloudUpload
                    size={40}
                    className="mb-2 text-white"
                  />

                  <span className="text-xs font-bold uppercase tracking-tighter text-white">
                    Change Cover
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <TbCloudUpload size={32} />
                </div>

                <p className="text-sm font-bold">
                  Drop artwork here
                </p>

                <p className="text-[10px] mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-8 flex flex-col gap-6">

          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest">
              Collection Title
            </label>

            <input
              type="text"
              placeholder="e.g. Character Concept Art"
              className="w-full border border-white/5 rounded-2xl px-5 py-4 focus:border-[#00d26a]/50 outline-none transition-all"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* VISIBILITY */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest">
              Privacy Settings
            </label>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    visibility: "public",
                  })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${
                  form.visibility === "public"
                    ? "border-[#00d26a]"
                    : "border-white/5"
                }`}
              >
                <Globe size={14} />
                Public
              </button>

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    visibility: "private",
                  })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${
                  form.visibility === "private"
                    ? "border-[#00d26a]"
                    : "border-white/5"
                }`}
              >
                <Lock size={14} />
                Private
              </button>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">

            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest">
                Brief Description
              </label>

              <span className="text-[10px] font-bold">
                {form.description?.length || 0}/300
              </span>
            </div>

            <textarea
              maxLength={300}
              placeholder="What is this collection about?"
              className="w-full min-h-[140px] border border-white/5 rounded-2xl px-5 py-4 focus:border-[#00d26a]/50 outline-none transition-all resize-none text-sm"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="mt-auto flex items-center gap-4 pt-4 border-t border-primary-line">

            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-xl bg-secondary font-bold text-sm transition-all"
            >
              Discard
            </button>

            <button
              onClick={handleCreate}
              disabled={isUploading}
              className="flex-1 py-4 rounded-2xl bg-green-500 font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(0,210,106,0.2)]"
            >
              {isUploading
                ? "Initializing..."
                : "Create Collection"}
            </button>

          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGalleryModal;