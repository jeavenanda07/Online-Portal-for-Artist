"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Tag, Trash2, Loader2 } from "lucide-react";
import { notify } from "@/utils/toastHelper";
import { useUserData } from "@/hooks/useUserData";

interface ArtworkFormData {
  art_file: File | null;
  artwork_title: string;
  description: string;
  artwork_type: "Digital" | "Physical";
  tags: string[];
  status: "For Sale" | "Not for Sale" | "Free Download";
  price: number;
  stocks: number;
}

export default function UploadArtworkModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (artwork: any) => void;
}) {
  const { userDetails } = useUserData();
  const [formData, setFormData] = useState<ArtworkFormData>({
    art_file: null,
    artwork_title: "",
    description: "",
    artwork_type: "Digital",
    tags: [],
    status: "Not for Sale",
    price: 0,
    stocks: 1,
  });
  const [artPreview, setArtPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const artInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, art_file: file }));
    setArtPreview(URL.createObjectURL(file));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (i: number) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }));
  };

  const handlePublish = async () => {
    if (!formData.art_file) { notify("Please upload the art file.", "error"); return; }
    if (!formData.artwork_title.trim()) { notify("Please provide a title.", "error"); return; }
    if (formData.status === "For Sale" && formData.price <= 0) { notify("Set a valid price.", "error"); return; }
    if (formData.status === "For Sale" && formData.stocks <= 0) { notify("Set a valid stock quantity.", "error"); return; }
    if (!userDetails?.user_profile_id) { notify("Session expired.", "error"); return; }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("art_file", formData.art_file);
      data.append("user_profile_id", userDetails.user_profile_id);
      data.append("artwork_title", formData.artwork_title);
      data.append("description", formData.description);
      data.append("artwork_type", formData.artwork_type);
      data.append("tags", JSON.stringify(formData.tags));
      data.append("status", formData.status);
      data.append("price", String(formData.price));
      data.append("stocks", String(formData.stocks));

      const res = await fetch("/api/artwork/create", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        notify(result.message || "Failed to publish.", "error");
        return;
      }

      notify("Artwork published!", "success");
      onSuccess?.(result.artwork);
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      console.error(err);
      notify("Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    "For Sale": "#22c55e",
    "Not for Sale": "#71717a",
    "Free Download": "#3b82f6",
  };

  return (
    <div className="flex items-center justify-center w-full mx-auto p-4">
      <div
        className="w-full rounded-2xl shadow-2xl bg-background overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex justify-between items-center border-1 border-primary-line"
        >
          <div>
            <h2 className="text-lg font-black  tracking-tight">Upload Artwork</h2>
            <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>
              Share your masterpiece with the community
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "#4b5563", border: "1px solid #1a2e1a" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Art File Upload */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-2 block">
              Art File *
            </label>
            <div
              onClick={() => artInputRef.current?.click()}
              className="relative bg-primary border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden"
            >
              {artPreview ? (
                <>
                  <img src={artPreview} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary" >
                      <Upload size={18} className="" />
                    </div>
                    <p className="text-xs font-bold  truncate max-w-[200px]">{formData.art_file?.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setArtPreview(null); setFormData((p) => ({ ...p, art_file: null })); }}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                    >
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" >
                    <Upload size={22} style={{ color: "#4ade80" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold ">Click to upload</p>
                    <p className="text-xs mt-1" style={{ color: "#4b5563" }}>PNG, JPG, GIF up to 50MB</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={artInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Artwork title *"
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium  outline-none transition-all bg-primary border-1 border-primary-line"
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onChange={(e) => setFormData({ ...formData, artwork_title: e.target.value })}
            />
            <textarea
              placeholder="Short story or description..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm  outline-none resize-none transition-all bg-primary border-1 border-primary-line"
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#1a2e1a")}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Type", key: "artwork_type", options: ["Digital", "Physical"] },
              { label: "Status", key: "status", options: ["Not for Sale", "For Sale", "Free Download"] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#4b5563" }}>{label}</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-primary outline-none"
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value as any })}
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Price & Stocks */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Price (PHP)", key: "price", type: "number", placeholder: "0.00" },
              { label: "Stocks", key: "stocks", type: "number", placeholder: "1" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#4b5563" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  disabled={formData.status !== "For Sale"}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium  outline-none transition-all disabled:opacity-30 bg-primary"
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2" style={{ color: "#4b5563" }}>
              <Tag size={12} /> Tags — press Enter to add
            </label>
            <div
              className="flex flex-wrap gap-2 p-3 rounded-xl transition-all bg-primary"
            >
              {formData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  {tag}
                  <button onClick={() => removeTag(i)} className="hover:text-red-400 transition-colors ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={formData.tags.length === 0 ? "e.g. Anime, Portrait, Abstract..." : "Add more..."}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm  placeholder:text-zinc-600 py-1"
              />
            </div>
          </div>

          {/* Status indicator */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: statusColors[formData.status], boxShadow: `0 0 8px ${statusColors[formData.status]}` }}
            />
            <p className="text-xs font-bold ">{formData.status}</p>
            {formData.status === "For Sale" && (
              <span className="ml-auto text-xs font-black" style={{ color: "#4ade80" }}>
                ₱{formData.price.toFixed(2)} · {formData.stocks} stock{formData.stocks !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end gap-3"
          style={{ borderTop: "1px solid #1a2e1a" }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ color: "#4b5563", border: "1px solid #1a2e1a" }}
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2"
            style={
              isSubmitting
                ? { background: "#1a2e1a", color: "#4b5563", cursor: "not-allowed" }
                : { background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#000", boxShadow: "0 0 20px rgba(34,197,94,0.25)" }
            }
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Artwork"}
          </button>
        </div>
      </div>
    </div>
  );
}