"use client"

import clsx from 'clsx';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";
import { PiImageSquareLight } from "react-icons/pi";
import artwork from "@/data/featuredArtwork.json"
import { useState } from 'react';
import FeaturedArtForm from '@/app/components/dashboard/FeaturedArtForm';

const FeaturedArtwork = () => {
  const [isActive, setIsActive] = useState(false);

  const handleFeaturedArtwork = () => {
    setIsActive(i => !i);
  }

  return (
    <div className='w-full relative min-h-screen text-[#eeeeee] p-8 font-sans '>
      
      
      <div className="flex items-center justify-between mb-10 px-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black text-[#64748b] uppercase tracking-[0.25em] mb-2">
            <Link href="/dashboard" className="hover:text-[#4ade80] transition-colors">Home</Link>
            <RiArrowRightSLine className="text-lg text-[#334155]" />
            <span className="text-white border-b-2 border-[#4ade80]">Featured Artwork</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Feature Management</h1>
        </div>

        <button
          onClick={handleFeaturedArtwork} 
          className='text-[10px] font-black text-[#4ade80] bg-background border border-[#4ade80]/30 hover:bg-[#4ade80] hover:text-[#090e0e] px-6 py-3 rounded-lg transition-all uppercase tracking-[0.2em]'
        >
          + Add New Artwork
        </button>
      </div>

    
      <div className="w-full bg-background border-2 border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        
        <div className="px-8 py-8 border-b-2 border-[#1e293b] bg-[#0f172a]/30">
          <h2 className="text-[13px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Registry of Featured Content</h2>
        </div>
          
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1200px]">
            <thead>
              <tr className="bg-primary text-[11px] uppercase tracking-[0.2em] text-[#f1f5f9]">
                <th className="px-6 py-6 font-black text-center">ID</th>
                <th className="px-6 py-6 font-black">Artwork</th>
                <th className="px-6 py-6 font-black">Artist</th>
                <th className="px-6 py-6 font-black">Campaign Title</th>
                <th className="px-6 py-6 font-black text-center">Duration</th>
                <th className="px-6 py-6 font-black text-center">Status</th>
                <th className="px-6 py-6 font-black text-center">Featured On</th>
                <th className="px-6 py-6 font-black text-right">Action</th>
              </tr>
            </thead>
    
            <tbody className="divide-y-2 divide-[#1e293b]">
              {artwork.slice(0, 10).map((u) => (
                <tr key={u.ARTWORK_ID} className="group hover:bg-[#0f172a] transition-all duration-150">
                  
                  
                  <td className="px-6 py-5 font-mono text-[12px] text-center text-[#60a5fa] font-bold">
                    <span className="bg-[#60a5fa]/10 px-2 py-1 rounded border border-[#60a5fa]/20">
                      #{u.ARTWORK_ID.slice(0, 6).toUpperCase()}
                    </span>
                  </td>

                 
                  <td className="px-6 py-5">
                    <div className="flex gap-4 items-center">
                      <div className="w-11 h-11 bg-[#1e293b] rounded-lg border-2 border-[#334155] flex items-center justify-center text-[#4ade80] group-hover:border-[#4ade80] transition-all">
                         <PiImageSquareLight className='text-2xl'/>
                      </div>
                      <div>
                        <p className='text-[15px] font-black text-white group-hover:text-[#4ade80] transition-colors cursor-pointer leading-none'>Preview Art</p>
                        <p className="text-[10px] text-[#64748b] mt-1 font-normal uppercase tracking-wider">Asset Ver: 1.0</p>
                      </div>
                    </div>
                  </td>

                
                  <td className="px-6 py-5">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={u.artist_profile.profileIcon || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxlUNgdBNoRtldCv3npbX2Lo_IPTNmnAW25Q&s"} 
                        alt="artist" 
                        className="w-10 h-10 rounded-full border-2 border-[#334155] group-hover:border-[#4ade80] transition-all"
                      />
                      <div>
                        <p className='text-[15px] font-black text-white leading-none group-hover:text-white'>{u.artist_profile.name}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-1 font-normal italic">{u.artist_profile.gmail}</p>
                      </div>
                    </div>
                  </td>

                 
                  <td className="px-6 py-5">
                    <p className='text-[14px] font-normal text-slate-300 line-clamp-1 max-w-[200px]'>{u.FEATURED_TITLE}</p>
                    <p className="text-[10px] text-[#64748b] mt-1 font-normal uppercase tracking-tighter">Detailed view enabled</p>
                  </td>

                 
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <p className='text-[11px] text-white font-mono font-normal'>{u.FEATURED_START}</p>
                      <div className='h-[2px] w-4 bg-[#1e293b] my-1'></div>
                      <p className='text-[11px] text-[#64748b] font-mono font-normal'>{u.FEATURED_END}</p>
                    </div>
                  </td>

               
                  <td className="px-6 py-5 text-center">
                    <span className={clsx('px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border-2', {
                      "bg-[#064e3b] text-[#4ade80] border-[#065f46]" : u.STATUS === "Active",
                      "bg-[#450a0a] text-[#f87171] border-[#7f1d1d]" : u.STATUS === "Expired"
                    })}>
                      {u.STATUS}
                    </span>
                  </td>
                  
                  
                  <td className="px-6 py-5 text-center text-[12px] text-slate-400 font-mono font-normal">
                    {u.DATE_FEATURED}
                  </td>

                 
                  <td className="px-6 py-5 text-right">
                    <button className='text-[10px] font-black text-[#f87171] bg-[#0a0a0a] border border-[#f87171]/30 hover:bg-[#f87171] hover:text-white px-5 py-2.5 rounded-lg transition-all uppercase tracking-[0.15em]'>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="p-6 bg-[#0f172a]/50 border-t-2 border-[#1e293b] text-center">
           <p className="text-[11px] font-black text-[#2e4053] uppercase tracking-[0.6em]">
             — Authorized Feature Log — Secure Access —
           </p>
        </div>
      </div>

      
      <div className={clsx('fixed transition-all duration-300 z-40 inset-0', {
        "hidden opacity-0" : !isActive,
        "block bg-black/80 backdrop-blur-md opacity-100" : isActive
      })}></div>

      
      {isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <FeaturedArtForm func={handleFeaturedArtwork}/>
        </div>
      )}
    </div>
  )
}

export default FeaturedArtwork;