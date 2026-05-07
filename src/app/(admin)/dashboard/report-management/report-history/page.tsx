'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";
import Violations from "@/data/ViolationHistory.json";
import DatePicker from '@/app/components/ui/DatePicker';

const ReportedUserSummary = () => {
  return (
    <div className="min-h-screen text-[#eeeeee] p-8 font-sans ">
      
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black text-[#64748b] uppercase tracking-[0.25em] mb-2">
            <Link href="/dashboard" className="hover:text-[#4ade80] transition-colors">Dashboard</Link>
            <RiArrowRightSLine className="text-lg text-[#334155]" />
            <span className="text-white border-b-2 border-[#4ade80]">Report Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Report History</h1>
        </div>
      </div>

      <div className="w-full bg-background border-2 border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        <div className="flex justify-between items-center px-8 py-8 border-b-2 border-[#1e293b] bg-[#0f172a]/30">
          <div>
            <h2 className="text-[13px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">System Violations Log</h2>
            <p className="text-[16px] text-[#4ade80] font-black mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#f87171] rounded-full animate-pulse"></span>
              {Violations.length} TOTAL ENTRIES DETECTED
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
                <th className="px-8 py-6 font-black">Report ID</th>
                <th className="px-8 py-6 font-black">Reported User</th>
                <th className="px-8 py-6 font-black text-center">Violation Type</th>
                <th className="px-8 py-6 font-black text-center">Enforcement</th>
                <th className="px-8 py-6 font-black text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-[#1e293b]">
              {Violations.slice(0, 10).map((u: any) => (
                <tr key={u.USER_ID} className="group hover:bg-[#0f172a] transition-all duration-150">
                  
                  <td className="px-8 py-6 font-mono text-[13px] text-[#60a5fa] font-bold">
                    <span className="bg-[#60a5fa]/10 px-2 py-1 rounded border border-[#60a5fa]/20">
                       #{u.USER_ID.slice(0, 8).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${u.reported_user.name}`} 
                        className="w-11 h-11 rounded-full border-2 border-[#334155] group-hover:border-[#4ade80] transition-all" 
                        alt="avatar" 
                      />
                      <div>
                        <p className="text-[16px] font-black text-white leading-none mb-1 group-hover:text-[#4ade80]">
                          {u.reported_user.name}
                        </p>
                        <p className="text-[12px] text-[#94a3b8] font-bold">{u.reported_user.gmail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <span className="text-[14px] text-slate-300 font-normal tracking-wide">
                      {u.VIOLATION_TYPE}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <span className={clsx(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border-2 shadow-sm",
                      {
                        "bg-[#450a0a] text-[#f87171] border-[#7f1d1d]": u.ACTION_TAKEN.includes("Ban"),
                        "bg-[#422006] text-[#fbbf24] border-[#78350f]": u.ACTION_TAKEN === "Warning",
                        "bg-[#78350f]/20 text-[#f59e0b] border-[#d97706]": u.ACTION_TAKEN === "Temporary Suspension", // AMBER COLOR
                        "bg-[#064e3b] text-[#4ade80] border-[#065f46]": u.ACTION_TAKEN === "Cleared"
                      }
                    )}>
                      {u.ACTION_TAKEN}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <button className={clsx(
                      "text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-lg transition-all border",
                      u.ACTION_TAKEN === "Cleared"
                        ? "bg-[#2563eb] text-white border-[#3b82f6] hover:bg-[#1d4ed8]"
                        : "bg-[#0a0a0a] text-[#94a3b8] border-[#334155] hover:border-[#f87171] hover:text-[#f87171]"
                    )}>
                      {u.ACTION_TAKEN === "Cleared" ? "Review" : "Manage"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-[#0f172a]/50 border-t-2 border-[#1e293b] text-center">
          <Link href="#" className="text-[11px] font-black text-[#4ade80] uppercase tracking-[0.4em] hover:text-white transition-all">
            — SEE ALL SECURITY REPORTS —
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportedUserSummary;