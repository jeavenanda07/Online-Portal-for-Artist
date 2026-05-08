"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import Checkout from "./Checkout";
import DownloadButton from "@/app/components/ui/DownloadButton";

export default function BuyButtonSection({ art, id }: { art: any; id: string }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [artDetails, setArtDetails] = useState<any>(art)
  console.log("art", artDetails)

  if (art.status === "For Sale") {
    return (
      <>
        <p className="text-3xl font-black mb-1">
          ₱{art.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-1.5 mb-5 text-zinc-500">
          <Package size={13} />
          <span className="text-xs font-bold">{art.stocks} in stock</span>
        </div>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] bg-[#00d26a] text-black cursor-pointer"
        >
          Buy Now
        </button>

        <Checkout 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          art={art}
        />
      </>
    );
  }

  if (art.status === "Free Download") {
    return <DownloadButton artworkId={id} />;
  }

  return (
    <p className="text-sm font-bold text-zinc-500">
      This artwork is not for sale.
    </p>
  );
}