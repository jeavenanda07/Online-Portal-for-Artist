"use client";

import React, { useState } from "react";
import { X, Download, Star, FileText, Calendar, Wallet, Truck } from "lucide-react";
import clsx from "clsx";
import AppreciationModal from "./AppreciationModal"; // Ensure this path is correct

interface Props {
  data: any;
  onClose: () => void;
}

export default function PurchaseDetailModal({ data, onClose }: Props) {
  const [showReview, setShowReview] = useState(false);
  const isDigital = data.deliveryType === "digital";

  return (
    <>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#1C1D21] w-full max-w-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          
          {/* Header Image/Banner */}
          <div className="h-32 bg-gradient-to-r from-green-500/20 to-purple-600/20 flex items-end p-8">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-white/10 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{data.artworkName}</h2>
              <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">Transaction ID: {data.id}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <InfoItem icon={<Calendar size={14}/>} label="Date" value={data.date} />
              <InfoItem icon={<Wallet size={14}/>} label="Amount" value={`₱${data.amount.toLocaleString()}`} />
              <InfoItem icon={<FileText size={14}/>} label="Type" value={data.type} isCaps />
              <InfoItem icon={<Star size={14}/>} label="Artist" value={data.artist} />
              <InfoItem 
                icon={isDigital ? <Download size={14}/> : <Truck size={14}/>} 
                label="Delivery" 
                value={data.deliveryType} 
                isCaps 
              />
              <InfoItem label="Payment" value={data.paymentStatus} isCaps color="text-green-400" />
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Notes / Remarks</p>
              <p className="text-sm text-zinc-300 leading-relaxed italic">"{data.notes || "No special remarks provided."}"</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              {isDigital && data.paymentStatus === "paid" && (
                <button className="flex-1 bg-green-400 hover:bg-green-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-400/20">
                  <Download size={16} /> Download Assets
                </button>
              )}

              {/* General: Review Button (Available for both Digital and Physical) */}
              {data.paymentStatus === "paid" && (
                <button 
                  onClick={() => setShowReview(true)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95"
                >
                  <Star size={16} className="text-yellow-400" /> Leave a Review
                </button>
              )}

              {/* Physical Specific: Tracking Info Placeholder */}
              {!isDigital && (
                <div className="flex-1 bg-white/5 text-zinc-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 border border-white/5 cursor-default text-center px-2">
                  <Truck size={14} /> Tracking info updates via inbox
                </div>
              )}

              <a 
                href={data.receiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent hover:text-green-400 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center transition-colors flex items-center justify-center"
              >
                View Receipt
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Appreciation Modal Overlay */}
      {showReview && (
        <AppreciationModal 
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          transactionData={data}
        />
      )}
    </>
  );
}

function InfoItem({ icon, label, value, isCaps, color }: any) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-2 mb-1">
        {icon} {label}
      </p>
      <p className={clsx(
        "text-sm font-bold",
        isCaps ? "uppercase tracking-tighter" : "",
        color ? color : "text-zinc-200"
      )}>
        {value}
      </p>
    </div>
  );
}