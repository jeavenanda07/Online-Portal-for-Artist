"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft, X, Loader2, CheckCircle, XCircle,
  Clock, Tag, DollarSign, Calendar,
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
  shipping_name?: string;
  shipping_address?: string;
  shipping_contact?: string;
  artist?: { full_name: string; username: string; avatar_pic: string | null };
  client?: { full_name: string; username: string; avatar_pic: string | null };
}

interface Props {
  requestId: string | null;
  activeTab: Tab;
  onBack: () => void;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  Pending:    { label: "Pending Review",  color: "text-yellow-500",  dot: "bg-yellow-400 animate-pulse" },
  Accepted:   { label: "Accepted",        color: "text-[#00d26a]",   dot: "bg-[#00d26a]" },
  Rejected:   { label: "Rejected",        color: "text-red-400",     dot: "bg-red-400" },
  InProgress: { label: "In Progress",     color: "text-blue-400",    dot: "bg-blue-400" },
  Completed:  { label: "Completed",       color: "text-purple-400",  dot: "bg-purple-400" },
  Cancelled:  { label: "Cancelled",       color: "text-zinc-500",    dot: "bg-zinc-500" },
};

export default function ChatMessagesArea({ requestId, activeTab, onBack, onClose }: Props) {
  const [request, setRequest] = useState<ArtRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const isArtist = activeTab === "Incoming";

  // Fetch the selected request detail
  useEffect(() => {
    if (!requestId) return;
    setLoading(true);

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

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
    if (!request) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/commission/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artRequestId: request.art_request_id, status }),
      });
      if (!res.ok) throw new Error();
      setRequest((prev) => prev ? { ...prev, status } : prev);
      notify(`Request ${status.toLowerCase()} successfully`, "success");
    } catch {
      notify("Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const person = isArtist ? request?.client : request?.artist;
  const statusCfg = STATUS_CONFIG[request?.status ?? "Pending"];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#141518] overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1C1D21] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {person && (
            <>
              <Image
                src={person.avatar_pic || "/avatar_placeholder.png"}
                alt={person.full_name}
                width={40}
                height={40}
                className="rounded-full object-cover border border-white/10"
              />
              <div>
                <p className="text-sm font-black text-white">{person.full_name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">@{person.username?.replace(/^@/, "")}</p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-[#00d26a]" />
          </div>
        )}

        {!loading && !request && (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
              Select a request to view details
            </p>
          </div>
        )}

        {!loading && request && (
          <>
            {/* Title + Status */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  {isArtist ? "Commission Request" : "Your Request"}
                </p>
                <h3 className="text-2xl font-black text-white">{request.title}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Description</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{request.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={12} className="text-[#00d26a]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Budget</p>
                </div>
                <p className="text-lg font-black text-white">₱{request.budget.toLocaleString()}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={12} className="text-[#00d26a]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Deadline</p>
                </div>
                <p className="text-sm font-bold text-white">
                  {request.deadline
                    ? new Date(request.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "No deadline"}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className="text-[#00d26a]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Art Type</p>
                </div>
                <p className="text-sm font-bold text-white">{request.art_type}</p>
              </div>
            </div>

            {/* Tags */}
            {request.tags?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={12} className="text-[#00d26a]" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tags</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-black px-3 py-1 rounded-full bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a] uppercase tracking-widest"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Images */}
            {request.reference_images?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                  Reference Images ({request.reference_images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {request.reference_images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(img)}
                      className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#00d26a]/50 transition-all group"
                    >
                      <Image
                        src={img}
                        alt={`ref-${i}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            {(request.shipping_name || request.shipping_address) && (
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Shipping Info</p>
                <div className="space-y-1.5 text-sm text-zinc-300">
                  {request.shipping_name && <p><span className="text-zinc-500">Name:</span> {request.shipping_name}</p>}
                  {request.shipping_address && <p><span className="text-zinc-500">Address:</span> {request.shipping_address}</p>}
                  {request.shipping_contact && <p><span className="text-zinc-500">Contact:</span> {request.shipping_contact}</p>}
                </div>
              </div>
            )}

            {/* ── ARTIST ACTIONS ── */}
            {isArtist && request.status === "Pending" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Decline
                </button>
                <button
                  onClick={() => handleStatusUpdate("Accepted")}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-[#00d26a] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00b85a] transition-all disabled:opacity-50 active:scale-95"
                >
                  {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Accept
                </button>
              </div>
            )}

            {/* Already actioned */}
            {isArtist && request.status !== "Pending" && (
              <div className="text-center py-4 text-xs font-black uppercase tracking-widest text-zinc-600">
                You have {request.status.toLowerCase()} this request
              </div>
            )}

            {/* ── CLIENT VIEW — status only ── */}
            {!isArtist && (
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  Current Status
                </p>
                <p className={`text-lg font-black ${statusCfg.color}`}>
                  {statusCfg.label}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Submitted {new Date(request.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <Image
            src={lightbox}
            alt="reference"
            width={800}
            height={800}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}