'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";
import jsonData from "@/data/reportedUser.json";
import DatePicker from '@/app/components/ui/DatePicker';

const ReportedUserSummary = () => {
  return (
    <div className="min-h-screen text-[#eeeeee] p-8 font-sans ">

      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black text-[#64748b] uppercase tracking-[0.25em] mb-2">
            <Link href="/dashboard" className="hover:text-[#4ade80] transition-colors">Home</Link>
            <RiArrowRightSLine className="text-lg text-[#334155]" />
            <span className="text-white border-b-2 border-[#4ade80]">Reported Users</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Reported Users</h1>
        </div>
      </div>

      <div className="w-full bg-background border-2 border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

        <div className="flex justify-between items-center px-8 py-8 border-b-2 border-[#1e293b] bg-[#0f172a]/30">
          <div>
            <h2 className="text-[13px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Latest List of Reported Users</h2>
            <p className="text-[16px] text-[#4ade80] font-black mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#f87171] rounded-full animate-pulse"></span>
              {jsonData.length} TOTAL REPORTS DETECTED
            </p>
          </div>
          <div className="scale-110">
            <DatePicker />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1100px]">
            <thead>
              <tr className="bg-[#1e293b] text-[12px] uppercase tracking-[0.2em] text-[#f1f5f9]">
                <th className="px-8 py-6 font-black text-center">Report ID</th>
                <th className="px-8 py-6 font-black">User</th>
                <th className="px-8 py-6 font-black">Reported By</th>
                <th className="px-8 py-6 font-black text-center">Date</th>
                <th className="px-8 py-6 font-black text-center">Status</th>
                <th className="px-8 py-6 font-black text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-[#1e293b]">
              {jsonData.slice(0, 10).map((u: any) => {

                const currentStatus = u.status?.toLowerCase();

                return (
                  <tr key={u.id} className="group hover:bg-[#0f172a] transition-all duration-150">

                    <td className="px-8 py-6 font-mono text-[12px] text-center text-[#60a5fa] font-bold">
                      <span className="bg-[#60a5fa]/10 px-2 py-1 rounded border border-[#60a5fa]/20">
                        #{u.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={u.profileIcon}
                          className="w-11 h-11 rounded-full border-2 border-[#334155] group-hover:border-[#4ade80] transition-all"
                          alt="avatar"
                        />
                        <div>
                          <p className="text-[16px] font-black text-white leading-none mb-1 group-hover:text-[#4ade80]">
                            {u.user}
                          </p>
                          <p className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider">{u.gmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="text-[14px] text-slate-300 font-normal tracking-wide italic">
                        {u.reportedBy}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-center text-[12px] text-slate-400 font-mono font-normal">
                      {u.reportDate}
                    </td>


                    <td className="px-8 py-6 text-center">
                      <span className={clsx(
                        "px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border-2 min-w-[150px]",
                        {

                          "bg-[#3d1d05] text-[#fb923c] border-[#7c2d12]": currentStatus === "pending",

                          "bg-[#450a0a] text-[#fca5a5] border-[#7f1d1d]": currentStatus === "warned" || currentStatus === "flagged",

                          "bg-[#064e3b] text-[#4ade80] border-[#065f46]": currentStatus === "success" || currentStatus === "cleared"
                        }
                      )}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all border bg-[#0a0a0a] text-[#58d68d] border-[#58d68d]/30 hover:bg-[#58d68d] hover:text-[#090e0e]">
                        Take Action
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-[#0f172a]/50 border-t-2 border-[#1e293b] text-center">
          <p className="text-[11px] font-black text-[#2e4053] uppercase tracking-[0.5em]">
            — End of Security List —
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportedUserSummary;