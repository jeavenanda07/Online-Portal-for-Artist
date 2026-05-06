"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { notify } from "@/utils/toastHelper";

export default function DownloadButton({ artworkId }: { artworkId: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/artwork/download?artwork_id=${artworkId}`);

      if (!res.ok) {
        const data = await res.json();
        notify(data.message || "Download failed.", "error");
        return;
      }

      // Get filename from Content-Disposition header
      const disposition = res.headers.get("Content-Disposition");
      const fileName = disposition?.match(/filename="(.+)"/)?.[1] || "artwork.jpg";

      // Trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      notify("Download started!", "success");

    } catch (err) {
      console.error(err);
      notify("Something went wrong.", "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
      style={{
        background: downloading ? "rgba(59,130,246,0.05)" : "rgba(59,130,246,0.1)",
        color: "#60a5fa",
        border: "1px solid rgba(59,130,246,0.2)",
        cursor: downloading ? "not-allowed" : "pointer",
      }}
    >
      {downloading
        ? <><Loader2 size={14} className="animate-spin" /> Downloading...</>
        : <><Download size={14} /> Free Download</>
      }
    </button>
  );
}