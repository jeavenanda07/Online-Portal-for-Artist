"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  ImageIcon,
  Send,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  Package,
  ExternalLink,
  Download,
  ZoomIn,
} from "lucide-react";

import { notify } from "@/utils/toastHelper";

type Tab = "Messages" | "Requests" | "Incoming";

interface ArtRequest {
  art_request_id: string;
  title: string;
  description: string;
  art_type: string;
  budget: number;
  deadline: string | null;
  tags: string[];
  reference_images: string[];
  status: string;
  created_at: string;
  updated_at?: string;

  shipping_name?: string;
  shipping_address?: string;
  shipping_contact?: string;

  artist?: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  };

  client?: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  };
}

interface Props {
  requestId: string | null;
  activeTab: Tab;
  onBack: () => void;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    dot: string;
  }
> = {
  Pending: {
    label: "Pending Review",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    dot: "bg-yellow-400 animate-pulse",
  },

  Accepted: {
    label: "Accepted",
    color: "text-[#00d26a]",
    bg: "bg-[#00d26a]/10",
    border: "border-[#00d26a]/20",
    dot: "bg-[#00d26a]",
  },

  Rejected: {
    label: "Rejected",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    dot: "bg-red-400",
  },

  InProgress: {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    dot: "bg-blue-400 animate-pulse",
  },

  Completed: {
    label: "Completed",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    dot: "bg-purple-400",
  },

  Cancelled: {
    label: "Cancelled",
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    dot: "bg-zinc-500",
  },
};

export default function ChatMessagesArea({
  requestId,
  activeTab,
  onBack,
  onClose,
}: Props) {
  const [request, setRequest] = useState<ArtRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isArtist = activeTab === "Incoming";

  useEffect(() => {
    if (!requestId) return;

    setLoading(true);
    setPopupOpen(false);

    const endpoint = isArtist
      ? "/api/commission/incoming"
      : "/api/commission/my-requests";

    fetch(endpoint)
      .then((r) => r.json())
      .then((data: ArtRequest[]) => {
        const found = data.find((r) => r.art_request_id === requestId);

        setRequest(found ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [requestId, isArtist]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [request]);

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
    if (!request) return;

    setUpdating(true);

    try {
      const res = await fetch("/api/commission/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artRequestId: request.art_request_id,
          status,
        }),
      });

      if (!res.ok) throw new Error();

      setRequest((prev) => (prev ? { ...prev, status } : prev));

      notify(`Request ${status.toLowerCase()} successfully`, "success");
    } catch {
      notify("Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const person = isArtist ? request?.client : request?.artist;

  const statusCfg = STATUS_CONFIG[request?.status ?? "Pending"];

  const img1 = request?.reference_images[0];
  console.log("img", img1);
  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* HEADER */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {loading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200" />

                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-200 rounded-full" />
                  <div className="h-2 w-16 bg-slate-200 rounded-full" />
                </div>
              </div>
            ) : person ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={person.avatar_pic || "/avatar_placeholder.png"}
                    alt={person.full_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-slate-100"
                  />

                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00d26a] border-2 border-white" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none mb-0.5">
                    {person.full_name}
                  </p>

                  <p className="text-[10px] text-slate-400 font-medium">
                    @{person.username?.replace(/^@/, "")} · Active now
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 font-medium">
                Select a conversation
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-50">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#00d26a]" />
            </div>
          )}

          {!loading && request && (
            <>
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200" />

                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {new Date(request.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* REQUEST CARD */}
              <div className="flex flex-col items-end gap-1.5">
                <button
                  onClick={() => setPopupOpen(true)}
                  className="group max-w-[72%] sm:max-w-[60%] text-left"
                >
                  <div className="bg-[#00d26a] rounded-2xl rounded-br-sm px-4 py-3 shadow-md hover:shadow-lg hover:bg-[#00c060] transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center shrink-0">
                        <ExternalLink size={12} className="text-black/70" />
                      </div>

                      <p className="text-[9px] font-black uppercase tracking-widest text-black/50">
                        Commission Request
                      </p>
                    </div>

                    <p className="text-sm font-black text-black leading-snug line-clamp-2">
                      {request.title}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3">
                      <span className="text-xs font-bold text-black/70">
                        ₱{request.budget.toLocaleString()}
                      </span>

                      <span className="text-[9px] text-black/40 font-medium">
                        ·
                      </span>

                      <span className="text-[9px] font-bold text-black/50 uppercase tracking-wide">
                        {request.art_type.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] font-black text-black/40 uppercase tracking-widest">
                      Tap to view details →
                    </p>
                  </div>
                </button>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.border}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`}
                  />

                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${statusCfg.color}`}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mr-1">
                  {new Date(request.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ACTIONS */}
        {!loading && request && isArtist && request.status === "Pending" && (
          <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <button
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 bg-red-50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
            >
              {updating ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <XCircle size={13} />
              )}
              Decline
            </button>

            <button
              onClick={() => handleStatusUpdate("Accepted")}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#00d26a] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00b85a] transition-all disabled:opacity-50 active:scale-95"
            >
              {updating ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CheckCircle size={13} />
              )}
              Accept
            </button>
          </div>
        )}

        {/* INPUT */}
        <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-[#00d26a]/40 transition-colors">
            <button className="text-slate-400 hover:text-[#00d26a] transition-colors shrink-0">
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  setMessage("");
                }
              }}
              placeholder="Message..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1.5"
            />

            <button
              disabled={!message.trim()}
              className="shrink-0 w-8 h-8 rounded-full bg-[#00d26a] disabled:bg-slate-200 flex items-center justify-center transition-all active:scale-90 disabled:cursor-not-allowed"
            >
              <Send size={14} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popupOpen && request && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={() => setPopupOpen(false)}
          />

          {/* MODAL */}
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-500">
            {/* HEADER */}
            <div className="p-6 md:px-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h5 className="font-black text-[10px] text-slate-300 uppercase tracking-[0.2em]">
                  Detailed View
                </h5>

                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {request.title}
                </p>
              </div>

              <button
                onClick={() => setPopupOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-all active:scale-90 cursor-pointer"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* LEFT SIDE — REFERENCES */}
                <div className="md:w-1/2 space-y-4">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    References
                  </h6>

                  <div
                    className={`grid gap-4 ${
                      request.reference_images?.length > 1
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {request.reference_images?.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightbox(img)}
                        className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 group cursor-pointer shadow-sm"
                      >
                        <Image
                          src={img1 ? img1 : ""}
                          alt={`reference-${idx}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="md:w-1/2 flex flex-col gap-6">
                  {/* ABOUT */}
                  <div>
                    <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      About the Project
                    </h6>

                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner italic text-sm text-slate-600 leading-relaxed">
                      "{request.description}"
                    </div>
                  </div>

                  {/* BUDGET + DEADLINE */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* BUDGET */}
                    <div className="bg-[#1AEF85]/10 p-5 rounded-3xl border border-[#1AEF85]/20">
                      <span className="text-[9px] font-black text-green-600 block mb-1 uppercase tracking-widest">
                        Budget
                      </span>

                      <span className="text-2xl font-black text-green-700">
                        ₱{request.budget.toLocaleString()}
                      </span>
                    </div>

                    {/* DEADLINE */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest">
                        Deadline
                      </span>

                      <span className="text-sm font-bold text-slate-700">
                        {request.deadline
                          ? new Date(request.deadline).toLocaleDateString(
                              "en-US"
                            )
                          : "No deadline"}
                      </span>
                    </div>
                  </div>

                  {/* TAGS */}
                  {request.tags && request.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {request.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black bg-white border border-slate-100 text-slate-400 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* STATUS */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border w-fit ${statusCfg.bg} ${statusCfg.border}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />

                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${statusCfg.color}`}
                    >
                      Status: {statusCfg.label}
                    </span>
                  </div>

                  {/* SHIPPING INFO */}
                  {(request.shipping_name || request.shipping_address) && (
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={14} className="text-slate-400" />

                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Shipping Info
                        </h6>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        {request.shipping_name && (
                          <p>
                            <span className="font-semibold text-slate-400">
                              Name:
                            </span>{" "}
                            {request.shipping_name}
                          </p>
                        )}

                        {request.shipping_address && (
                          <p>
                            <span className="font-semibold text-slate-400">
                              Address:
                            </span>{" "}
                            {request.shipping_address}
                          </p>
                        )}

                        {request.shipping_contact && (
                          <p>
                            <span className="font-semibold text-slate-400">
                              Contact:
                            </span>{" "}
                            {request.shipping_contact}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="pt-4 mt-auto">
                    {isArtist && request.status === "Pending" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleStatusUpdate("Rejected")}
                          disabled={updating}
                          className="py-4 rounded-2xl border border-red-200 bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          {updating ? "Loading..." : "Decline Request"}
                        </button>

                        <button
                          onClick={() => handleStatusUpdate("Accepted")}
                          disabled={updating}
                          className="py-4 rounded-2xl bg-[#00d26a] text-black text-[11px] font-black uppercase tracking-widest hover:bg-[#00b85a] transition-all"
                        >
                          {updating ? "Loading..." : "Accept Request"}
                        </button>
                      </div>
                    ) : (
                      <button className="w-full py-4 rounded-2xl bg-red-50 border border-red-100 text-red-400 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-100 transition-all">
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>

          <Image
            src={lightbox}
            alt="reference preview"
            width={900}
            height={900}
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <a
            href={lightbox}
            download={`reference-${Date.now()}.jpg`}
            onClick={(e) => e.stopPropagation()}
            className="mt-6 flex items-center gap-2 bg-white text-black text-[11px] font-black px-8 py-3 rounded-full uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
          >
            <Download size={15} />
            Download Image
          </a>
        </div>
      )}
    </>
  );
}
