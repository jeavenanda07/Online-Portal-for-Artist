"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import ConversationsList from "./ConversationsList";
import ChatMessagesArea from "./ChatMessagesArea";
import { X } from "lucide-react";

type Tab = "Messages" | "Requests" | "Incoming";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;     
  defaultRequestId?: string;
}

export default function ChatPopUp({ isOpen, onClose, defaultTab, defaultRequestId }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(defaultRequestId ?? null);
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab ?? "Messages");

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
    if (defaultRequestId) setSelectedId(defaultRequestId);
  }, [defaultTab, defaultRequestId]);

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const handleSelect = (id: string, tab: Tab) => {
    setSelectedId(id);
    setActiveTab(tab);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="w-full sm:w-[95%] max-w-[1400px] h-full sm:h-[90vh]">
      <div className="relative w-full h-full bg-[#141518] sm:border border-white/5 sm:rounded-[3rem] shadow-2xl flex overflow-hidden">

        {/* SIDEBAR */}
        <div className={`${selectedId ? "hidden" : "flex"} md:flex w-full md:w-[380px] h-full flex-shrink-0 relative`}>
          <button onClick={handleClose} className="md:hidden absolute top-6 right-6 z-20 p-2 bg-white/5 text-zinc-400 rounded-full">
            <X size={20} />
          </button>
          <ConversationsList
            onSelect={handleSelect}
            selectedId={selectedId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* CHAT AREA */}
        <div className={`${!selectedId ? "hidden" : "flex"} md:flex flex-1 h-full`}>
          <ChatMessagesArea
            requestId={selectedId}
            activeTab={activeTab}
            onBack={() => setSelectedId(null)}
            onClose={handleClose}
          />
        </div>

        {/* Desktop close */}
        <button
          onClick={handleClose}
          className="hidden md:block absolute top-8 right-8 z-[110] p-2 bg-white/5 hover:bg-white/10 text-zinc-500 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </Modal>
  );
}