"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Artistic Element */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-md"
      >
        <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>

        <h1 className="text-4xl md:text-5xl font-heading italic uppercase tracking-tighter text-white mb-4">
          Palette <br /> Interrupted
        </h1>
        
        <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest leading-relaxed mb-10">
          Something went wrong on our end. The canvas couldn't load quite right.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>

          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Studio
          </Link>
        </div>
      </motion.div>

      {/* Decorative Footer info */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
          Error Code: 500_ARTISTRY_HALT
        </p>
      </div>
    </div>
  );
}