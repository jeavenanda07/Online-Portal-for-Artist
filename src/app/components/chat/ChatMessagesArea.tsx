// // app/components/chat/ChatMessagesArea.tsx
// "use client";

// import {
//   Paperclip,
//   Image as ImageIcon,
//   ChevronLeft,
//   MoreHorizontal,
//   X,
// } from "lucide-react";

// interface ChatAreaProps {
//   onBack: () => void;
//   onClose: () => void; // Added onClose prop
// }

// export default function ChatMessagesArea({ onBack, onClose }: ChatAreaProps) {
//   return (
//     <div className="flex-1 bg-white flex flex-col sm:rounded-r-[3rem] overflow-hidden">
//       {/* Header */}
//       <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//         <div className="flex items-center gap-3 md:gap-4">
//           {/* Mobile Back Button - Navigates to List */}
//           <button
//             onClick={onBack}
//             className="md:hidden p-1 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <ChevronLeft size={28} />
//           </button>

//           <img
//             src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
//             alt="Jeaven"
//             className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
//           />
//           <div>
//             <h4 className="font-semibold text-slate-800 text-sm md:text-base">
//               Jeaven A. Paras
//             </h4>
//             <div className="flex items-center gap-1.5 mt-0.5">
//               <div className="w-2 h-2 bg-green-500 rounded-full" />
//               <p className="text-xs text-slate-500 font-medium">Active</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-1">
//           <button className="hidden md:block text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors">
//             <MoreHorizontal size={20} />
//           </button>

//           {/* Mobile-Only Close Button - Exits Modal */}
//           <button
//             onClick={onClose}
//             className="md:hidden p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition-all"
//           >
//             <X size={24} />
//           </button>
//         </div>
//       </div>

//       {/* Messages Scroll Area */}
//       <div className="flex-1 p-4 md:p-8 space-y-4 overflow-y-auto bg-slate-50 flex flex-col">
//         <div className="flex items-end gap-3 max-w-[85%] md:max-w-[70%]">
//           <img
//             src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
//             alt="avatar"
//             className="w-8 h-8 rounded-full flex-shrink-0"
//           />
//           <div className="bg-white p-4 rounded-3xl rounded-bl-lg text-slate-800 text-sm shadow-sm font-medium border border-slate-100">
//             I'm good, thanks! How about you?
//           </div>
//         </div>

//         <div className="bg-[#1AEF85] p-4 rounded-3xl rounded-br-lg text-black text-sm max-w-[85%] md:max-w-[70%] self-end ml-auto font-medium shadow-green-200 shadow-lg">
//           Hello, how are you?
//         </div>
//       </div>

//       {/* Input Field */}
//       <div className="p-2 md:p-4 border-t border-slate-100 bg-white">
//         <div className="m-1 md:m-2 mb-2 md:mb-4 rounded-full flex items-center gap-1 md:gap-2 shadow-inner shadow-slate-100 border border-slate-100 px-2 md:px-4">
//           <button className="p-2 text-slate-400 hover:text-green-500 transition-colors">
//             <ImageIcon size={20} />
//           </button>
//           <input
//             type="text"
//             placeholder="Message..."
//             className="flex-1 text-sm bg-transparent outline-none px-2 py-3 text-slate-700"
//           />
//           <button className="px-5 md:px-8 py-2 md:py-2.5 bg-[#1AEF85] text-black text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-md">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  ImageIcon,
  ChevronLeft,
  X,
  ExternalLink,
  Download,
  Search,
} from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ChatMessagesArea({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("all_requests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRequestList(parsed);
        } else if (parsed) {
          setRequestList([parsed]);
        }
      }
    }
  }, []);

  const handleDeleteRequest = (indexToDelete: number) => {
    if (confirm("Permanently delete this specific request?")) {
      const updatedList = requestList.filter(
        (_, index) => index !== indexToDelete,
      );
      localStorage.setItem("all_requests", JSON.stringify(updatedList));
      setRequestList(updatedList);
      setIsDetailsOpen(false);
      setActiveRequest(null);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col sm:rounded-r-[3rem] overflow-hidden border-l border-slate-100 relative h-full">
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="md:hidden p-1 text-slate-600 cursor-pointer hover:bg-slate-50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img
              src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
              alt="Artist"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-none mb-1">
              Jeaven A. Paras
            </h4>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">
              Artist • Philippines
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-slate-50 hover:bg-red-50 hover:text-red-500 p-2 rounded-full transition-all text-slate-300 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto bg-slate-50 flex flex-col scrollbar-hide">
        {requestList.map((req, index) => (
          <div
            key={index}
            className="self-end ml-auto max-w-[85%] md:max-w-[75%] flex flex-col items-end gap-2 animate-in slide-in-from-right duration-500"
          >
            <button
              onClick={() => {
                setActiveRequest({ ...req, index });
                setIsDetailsOpen(true);
              }}
              className="bg-[#1AEF85] py-3 px-5 rounded-2xl rounded-br-none text-black shadow-lg flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95 text-left border border-black/5 cursor-pointer"
            >
              <div className="bg-black text-white p-1.5 rounded-lg shadow-md">
                <ExternalLink size={14} />
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] uppercase opacity-60 font-black tracking-[0.15em] leading-none mb-1">
                  Commission Request #{index + 1}
                </p>
                <p className="text-sm font-black leading-none truncate max-w-[120px]">
                  {req.Title}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                Status: <span className="text-yellow-600">Pending</span>
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-end gap-3 max-w-[85%] md:max-w-[70%]">
          <img
            src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
            alt="avatar"
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-white shadow-sm"
          />
          <div className="bg-white p-4 rounded-2xl rounded-bl-none text-slate-600 text-[13px] shadow-sm font-medium border border-slate-100 leading-relaxed">
            Hello! I've received your requests. I'll review them and get back to
            you!
          </div>
        </div>
      </div>

      {/* --- FULL DETAILS LANDSCAPE MODAL --- */}
      {isDetailsOpen && activeRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={() => setIsDetailsOpen(false)}
          />
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-500">
            <div className="p-6 md:px-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h5 className="font-black text-[10px] text-slate-300 uppercase tracking-[0.2em]">
                  Detailed View
                </h5>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {activeRequest.Title}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-all active:scale-90 cursor-pointer"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="md:w-1/2 space-y-4">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    References
                  </h6>
                  <div
                    className={`grid gap-4 ${activeRequest.References?.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    {activeRequest.References?.map(
                      (img: string, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPreviewImage(img)}
                          className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 group cursor-pointer shadow-sm"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">
                            <Search size={24} className="mb-2" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="md:w-1/2 flex flex-col gap-6">
                  <div>
                    <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      About the Project
                    </h6>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner italic text-sm text-slate-600 leading-relaxed">
                      "{activeRequest.Description}"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1AEF85]/10 p-5 rounded-3xl border border-[#1AEF85]/20">
                      <span className="text-[9px] font-black text-green-600 block mb-1 uppercase tracking-widest">
                        Budget
                      </span>
                      <span className="text-2xl font-black text-green-700">
                        ₱{activeRequest.Budget}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest">
                        Deadline
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {activeRequest.Deadline}
                      </span>
                    </div>
                  </div>

                  {activeRequest.Tags && activeRequest.Tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeRequest.Tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black bg-white border border-slate-100 text-slate-400 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteRequest(activeRequest.index)}
                      className="w-full bg-red-50 text-red-500 text-[10px] font-black py-4 rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE LIGHTBOX & DOWNLOAD --- */}
      {selectedPreviewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
            onClick={() => setSelectedPreviewImage(null)}
          />
          <div className="relative z-[210] flex flex-col items-center gap-6">
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#1AEF85] transition-colors cursor-pointer"
            >
              <X size={32} />
            </button>
            <img
              src={selectedPreviewImage}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500 border-4 border-white/10"
            />
            <a
              href={selectedPreviewImage}
              download={`reference-${Date.now()}.jpg`}
              className="bg-[#1AEF85] text-black text-[11px] font-black px-10 py-4 rounded-full flex items-center gap-3 uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 cursor-pointer"
            >
              <Download size={18} /> Download Original Image
            </a>
          </div>
        </div>
      )}

      {/* FOOTER INPUT */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100">
        <div className="bg-slate-100/80 rounded-full px-5 py-1.5 flex items-center gap-3 border border-slate-200">
          <ImageIcon
            className="text-slate-400 hover:text-[#1AEF85] cursor-pointer transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-[13px] py-2.5"
          />
          <button className="bg-[#1AEF85] text-black text-[9px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
