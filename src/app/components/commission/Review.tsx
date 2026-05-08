"use client";

import Image from "next/image";
import { FinalCommissionData } from "@/types/commission";
import { Loader2 } from "lucide-react";

interface Props {
  formData: FinalCommissionData;
  goBack: () => void;
  submit: () => void;
  submitting?: boolean;
}

const Review = ({ formData, goBack, submit, submitting }: Props) => {
  const { tags, title, description, artType, budget, deadline, images = [] } = formData;

  const info = [
    { label: "Art Type", value: artType },
    { label: "Budget", value: `$${budget}` },
    {
      label: "Deadline",
      value: deadline ? new Date(deadline).toLocaleDateString("en-US") : "No deadline",
    },
    { label: "Shipping Name", value: (formData as any).shippingName || "—" },
    { label: "Shipping Address", value: (formData as any).shippingAddress || "—" },
    { label: "Shipping Contact", value: (formData as any).shippingContact || "—" },
  ];

  return (
    <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">

      {/* Title + Description */}
      <div>
        <h3 className="text-lg font-bold text-white">
          {title || "Untitled Commission"}
        </h3>
        <p className="text-sm text-zinc-400 mt-1">
          {description || "No description provided."}
        </p>
      </div>

      <hr className="border-white/5" />

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Reference Images */}
        <div className="lg:w-[40%] flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Reference ({images.length})
          </p>

          <div className="relative h-48 rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
            {images.length > 0 ? (
              <Image
                src={images[0].url}
                alt="main reference"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-zinc-600">
                No images uploaded
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                  <Image src={img.url} alt={`thumb-${i}`} fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Tags */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags?.length ? (
                tags.map((tag) => (
                  <span key={tag} className="bg-[#00d26a]/10 text-[#00d26a] border border-[#00d26a]/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-600">No tags</span>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {info.map((item) => (
              <div key={item.label} className="bg-zinc-900/60 rounded-xl px-3 py-2.5 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {item.label}
                </p>
                <p className="text-sm text-white font-medium mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
        <p className="text-xs text-zinc-500">Review your details before submitting.</p>
        <div className="flex gap-2">
          <button
            onClick={goBack}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d26a] hover:bg-[#00b85a] text-black text-xs font-black uppercase tracking-widest transition-all disabled:opacity-60 active:scale-95"
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? "Sending..." : "Send Commission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;