'use client';

import clsx from 'clsx';
import jsonData from "@/data/reportedUser.json"
import DatePicker from '@/app/components/ui/DatePicker';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";

const UserManagement = () => {
  return (
    <div className='w-full min-h-screen text-[#eeeeee] p-8 font-sans'>


      <div className="flex items-center justify-between mb-10 px-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black text-[#64748b] uppercase tracking-[0.25em] mb-2">
            <Link href="/dashboard" className="hover:text-[#4ade80] transition-colors">Home</Link>
            <RiArrowRightSLine className="text-lg text-[#334155]" />
            <span className="text-white border-b-2 border-[#4ade80]">Users Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Account Control</h1>
        </div>
      </div>


      <div className="w-full bg-background border-2 border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

        <div className="flex justify-between items-center px-8 py-8 border-b-2 border-[#1e293b] bg-[#0f172a]/30">
          <div>
            <h2 className='text-[13px] font-black text-[#94a3b8] uppercase tracking-[0.3em]'>List of Registered Users</h2>
            <p className='text-[16px] text-[#4ade80] font-black mt-1 flex items-center gap-2'>
              <span className="w-2.5 h-2.5 bg-[#4ade80] rounded-full animate-pulse"></span>
              {jsonData.length} TOTAL ACCOUNTS REGISTERED
            </p>
          </div>
          <div className="scale-110">
            <DatePicker />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1000px]">
            <thead>
              <tr className="bg-[#1e293b] text-[12px] uppercase tracking-[0.2em] text-[#f1f5f9]">
                <th className="px-8 py-6 font-black text-center">User ID</th>
                <th className="px-8 py-6 font-black">Account Profile</th>
                <th className="px-8 py-6 font-black text-center">Date Joined</th>
                <th className="px-8 py-6 font-black text-center">Last Activity</th>
                <th className="px-8 py-6 font-black text-center">Status</th>
                <th className="px-8 py-6 font-black text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-[#1e293b]">
              {jsonData.slice(0, 10).map((u: any) => (
                <tr key={u.id} className="group hover:bg-[#0f172a] transition-all duration-150">

                  <td className="px-8 py-5 font-mono text-[13px] text-center text-[#60a5fa] font-bold">
                    <span className="bg-[#60a5fa]/10 px-2 py-1 rounded border border-[#60a5fa]/20">
                      #{u.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex gap-4 items-center">
                      <img
                        src={u.profileIcon}
                        alt="profile"
                        className="w-11 h-11 rounded-full border-2 border-[#334155] group-hover:border-[#4ade80] transition-all"
                      />
                      <div>
                        <p className='text-[16px] font-black text-white leading-none group-hover:text-[#4ade80] transition-colors'>{u.user}</p>
                        <p className="text-[12px] text-[#94a3b8] mt-1 font-normal italic">{u.gmail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center text-[12px] text-slate-400 font-mono font-normal">
                    {u.reportDate}
                  </td>
                  <td className="px-8 py-5 text-center text-[12px] text-[#64748b] font-mono font-normal italic">
                    {u.reportDate}
                  </td>


                  <td className="px-8 py-5 text-center">
                    <span className={clsx(
                    
                      'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border-2 shadow-sm min-w-[120px]',
                      {
                        
                        "bg-[#064e3b] text-[#4ade80] border-[#065f46]": u.status?.toLowerCase() === "active",
                        "bg-[#450a0a] text-[#f87171] border-[#7f1d1d]": u.status?.toLowerCase() === "banned",
                        "bg-[#78350f]/20 text-[#f59e0b] border-[#d97706]": u.status?.toLowerCase() === "suspended",

                       
                        "bg-[#450a0a]  text-[#fca5a5] border-[#7f1d1d]": u.status?.toLowerCase() === "warned" || u.status?.toLowerCase() === "flagged",
                        "bg-[#3d1d05] text-[#fb923c] border-[#7c2d12]": u.status?.toLowerCase() === "pending"
                      }
                    )}>
                      {u.status || "Unknown"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button className='text-[10px] font-black text-[#4ade80] bg-[#0a0a0a] border border-[#4ade80]/30 hover:bg-[#4ade80] hover:text-[#090e0e] px-5 py-2.5 rounded-lg transition-all uppercase tracking-[0.15em]'>
                      Manage Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-[#0f172a]/50 border-t-2 border-[#1e293b] text-center">
          <p className="text-[11px] font-black text-[#2e4053] uppercase tracking-[0.6em]">
            — System Registry Access — Secure Data Link —
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserManagement;