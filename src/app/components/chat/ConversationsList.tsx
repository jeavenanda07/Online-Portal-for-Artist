"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { Search, Loader2, Inbox, Send } from "lucide-react";
import Image from "next/image";
import formatPostDate from "@/utils/date";

const NAV_TABS = ["Messages", "Requests", "Incoming"] as const;
type Tab = typeof NAV_TABS[number];

interface ArtRequest {
  art_request_id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  budget: number;
  artist?: { full_name: string; username: string; avatar_pic: string | null };
  client?: { full_name: string; username: string; avatar_pic: string | null };
}

interface Props {
  onSelect: (id: string, tab: Tab) => void;
  selectedId: string | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Pending:    "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Accepted:   "text-[#00d26a] bg-[#00d26a]/10 border-[#00d26a]/20",
  Rejected:   "text-red-400 bg-red-500/10 border-red-500/20",
  InProgress: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Completed:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Cancelled:  "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
};

const STATUS_DOT: Record<string, string> = {
  Pending:    "bg-yellow-400 animate-pulse",
  Accepted:   "bg-[#00d26a]",
  Rejected:   "bg-red-400",
  InProgress: "bg-blue-400 animate-pulse",
  Completed:  "bg-purple-400",
  Cancelled:  "bg-zinc-500",
};

export default function ConversationsList({ onSelect, selectedId, activeTab, onTabChange }: Props) {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<ArtRequest[]>([]);
  const [incoming, setIncoming] = useState<ArtRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Requests = client's sent commissions
  useEffect(() => {
    if (activeTab !== "Requests") return;
    setLoading(true);
    fetch("/api/commission/my-requests")
      .then((r) => r.json())
      .then((d) => setRequests(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);


  // Incoming = artist's received commissions
  useEffect(() => {
    if (activeTab !== "Incoming") return;
    setLoading(true);
    fetch("/api/commission/incoming")
      .then((r) => r.json())
      .then((d) => setIncoming(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  const currentList = activeTab === "Requests"
    ? requests
    : activeTab === "Incoming"
    ? incoming
    : [];

  const filtered = currentList.filter((r) => {
    // Requests tab: show artist info (who I sent to)
    // Incoming tab: show client info (who sent to me)
    const person = activeTab === "Requests" ? r.artist : r.client;
    return (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      person?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      person?.username?.toLowerCase().includes(search.toLowerCase())
    );
  });

  console.log("incoming", incoming)
  console.log("requests", requests)
  return (
    <div className="w-full h-full bg-[#1C1D21] border-r border-white/5 flex flex-col">

      {/* HEADER */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">INBOX</h2>
        <p className="text-[10px] font-black text-[#00d26a] uppercase tracking-[0.3em] mt-1">
          ARTISTRY HUB
        </p>
      </div>

      {/* SEARCH */}
      <div className="px-6 pt-4 pb-3">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00d26a] transition-colors"
            size={15}
          />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#141518] border border-white/5 rounded-2xl outline-none text-sm focus:border-[#00d26a]/30 transition-all placeholder:text-zinc-600 text-white"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="px-6 pb-4">
        <div className="flex p-1 bg-[#141518] rounded-2xl border border-white/5 gap-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={clsx(
                "flex-1 py-2.5 rounded-xl text-center transition-all text-[10px] font-black uppercase tracking-widest",
                activeTab === tab
                  ? "bg-[#00d26a] text-black shadow-lg"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">

        {/* Messages tab */}
        {activeTab === "Messages" && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Send size={20} className="text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
              No messages yet
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && activeTab !== "Messages" && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={22} className="animate-spin text-[#00d26a]" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && activeTab !== "Messages" && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Inbox size={20} className="text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
              {activeTab === "Requests" ? "No sent requests" : "No incoming requests"}
            </p>
          </div>
        )}

        {/* Items */}
        {!loading && filtered.map((req) => {
          // ✅ Requests tab: the "other person" is the artist I commissioned
          // ✅ Incoming tab: the "other person" is the client who commissioned me
          const person = activeTab === "Requests" ? req.artist : req.client;
          const isSelected = selectedId === req.art_request_id;

          return (
            <button
              key={req.art_request_id}
              onClick={() => onSelect(req.art_request_id, activeTab)}
              className={clsx(
                "w-full p-4 rounded-2xl flex items-start gap-3 transition-all text-left group",
                isSelected
                  ? "bg-[#00d26a]/10 border border-[#00d26a]/20"
                  : "border border-transparent hover:bg-white/5 hover:border-white/5"
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <Image
                  src={person?.avatar_pic || "/avatar_placeholder.png"}
                  alt={person?.full_name || "User"}
                  width={42}
                  height={42}
                  className="rounded-full object-cover border border-white/10"
                  style={{ width: 42, height: 42 }}
                />
                {/* Status dot on avatar */}
                <div
                  className={clsx(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1C1D21]",
                    STATUS_DOT[req.status] ?? "bg-zinc-500"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Name + date row */}
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-black text-white truncate">
                    {person?.full_name || "Unknown Artist"}
                  </p>
                  <p className="text-[10px] text-zinc-600 shrink-0">
                    {formatPostDate(req.updated_at || req.created_at)}
                  </p>
                </div>

                {/* Username */}
                <p className="text-[10px] text-zinc-600 font-mono truncate mb-1.5">
                  @{person?.username?.replace(/^@/, "") || "unknown"}
                </p>

                {/* Request title */}
                <p className={clsx(
                  "text-xs truncate mb-2",
                  isSelected ? "text-zinc-300" : "text-zinc-500"
                )}>
                  {req.title}
                </p>

                {/* Status badge */}
                <span className={clsx(
                  "inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  STATUS_COLORS[req.status] ?? STATUS_COLORS.Pending
                )}>
                  {req.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}