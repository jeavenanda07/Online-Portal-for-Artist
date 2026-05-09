"use client";

import classNames from "clsx";
import { useState } from "react";
import ImgRef from "./ImgRef";
import Details from "./Details";
import Review from "./Review";
import { notify } from "@/utils/toastHelper";
import { FinalCommissionData } from "@/types/commission";
import { RiArrowRightSLine } from "react-icons/ri";
import { X } from "lucide-react";
import ChatPopUp from "@/app/components/chat/ChatPopUp";

const nav = [
  { number: 1, name: "Reference Images" },
  { number: 2, name: "Details" },
  { number: 3, name: "Review" },
];

interface Props {
  func: (value: boolean) => void;
  username?: String;
}

const CommissionForm = ({ func, username }: Props) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artType: "DigitalArt",
    deadline: "",
    budget: "",
    shippingName: "",
    shippingAddress: "",
    shippingContact: "",
  });
  const [reviewData, setReviewData] = useState<FinalCommissionData | null>(null);

  // ✅ Chat state — opened after successful submission
  const [chatOpen, setChatOpen] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handleTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = inputValue.trim();
      if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
      setInputValue("");
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) { notify("Title is required", "error"); return; }
    if (!formData.description.trim()) { notify("Description is required", "error"); return; }
    if (!formData.budget || isNaN(Number(formData.budget))) { notify("Enter a valid budget", "error"); return; }
    if (tags.length < 1) { notify("Add at least 1 tag", "error"); return; }

    const final: FinalCommissionData = {
      ...formData,
      tags,
      images,
      uploadedImageUrls,
      commissionTo: username as string ?? "",
      createdAt: new Date().toLocaleString(),
    };

    setReviewData(final);
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!reviewData) return;
    setSubmitting(true);
  
    // 👇 Check what's actually being sent
    console.log("uploadedImageUrls at submit:", uploadedImageUrls);
    console.log("reviewData.uploadedImageUrls:", reviewData.uploadedImageUrls);
  
    try {
      const res = await fetch("/api/commission/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistUsername: username,
          title: reviewData.title,
          description: reviewData.description,
          artType: reviewData.artType,
          budget: reviewData.budget,
          deadline: reviewData.deadline || null,
          tags: reviewData.tags,
          referenceImages: uploadedImageUrls, // from state, not reviewData
          shippingName: reviewData.shippingName,
          shippingAddress: reviewData.shippingAddress,
          shippingContact: reviewData.shippingContact,
        }),
      })
      const data = await res.json();

      if (!res.ok) {
        notify(data.error ?? "Failed to send commission", "error");
        return;
      }

      notify("Commission sent! Opening your request... 🎨", "success");

      // ✅ Store the new request ID and open chat on "Requests" tab
      setSubmittedRequestId(data.art_request_id);

      // Close the form and open chat after short delay
      setTimeout(() => {
        func(false);       // close commission form
        setChatOpen(true); // open chatbox
      }, 1000);

    } catch (err) {
      console.error(err);
      notify("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center w-full px-4">
        <section className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-primary">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">
                Commission Request
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Sending to{" "}
                <span className="text-[#00d26a] font-bold">@{username}</span>
              </p>
            </div>
            <button
              onClick={() => func(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-[#00d26a]/40 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* STEPPER */}
          <div className="flex items-center px-6 py-4 border-b border-white/5 bg-secondary/40">
            {nav.map((item) => (
              <div key={item.number} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <span className={classNames(
                    "h-7 w-7 flex items-center justify-center rounded-full text-xs font-black transition-all",
                    {
                      "bg-[#00d26a] text-black": step === item.number,
                      "bg-[#00d26a]/20 text-[#00d26a]": step > item.number,
                      "bg-zinc-800 text-zinc-500": step < item.number,
                    }
                  )}>
                    {step > item.number ? "✓" : item.number}
                  </span>
                  <span className={classNames(
                    "hidden sm:block text-xs font-bold uppercase tracking-widest transition-colors",
                    {
                      "text-white": step === item.number,
                      "text-[#00d26a]": step > item.number,
                      "text-zinc-600": step < item.number,
                    }
                  )}>
                    {item.name}
                  </span>
                </div>
                {item.number !== 3 && (
                  <RiArrowRightSLine className="mx-2 text-zinc-700 flex-1 max-w-[24px]" />
                )}
              </div>
            ))}
          </div>

          {/* CONTENT SLIDER */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              <div className="w-full shrink-0 p-6">
                <ImgRef
                  images={images}
                  setImages={setImages}
                  goNext={() => setStep(2)}
                  func={func}
                  onUploadComplete={(urls) => setUploadedImageUrls(urls)}
                />
              </div>
              <div className="w-full shrink-0 p-6">
                <Details
                  formData={formData}
                  tags={tags}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleTag={handleTag}
                  removeTag={(tag: string) => setTags((prev) => prev.filter((t) => t !== tag))}
                  handleChange={(e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  submit={handleSubmit}
                  goBack={() => setStep(1)}
                  images={images}
                />
              </div>
              <div className="w-full shrink-0 p-6">
                {reviewData && (
                  <Review
                    formData={reviewData}
                    goBack={() => setStep(2)}
                    submit={handleFinalSubmit}
                    submitting={submitting}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ✅ Chat opens after submission — auto-selects the new request */}
      <ChatPopUp
        isOpen={chatOpen}
        onClose={() => {
          setChatOpen(false);
          setSubmittedRequestId(null);
        }}
        defaultTab="Requests"                          // ✅ client sees their sent requests
        defaultRequestId={submittedRequestId ?? undefined}
      />
    </>
  );
};

export default CommissionForm;