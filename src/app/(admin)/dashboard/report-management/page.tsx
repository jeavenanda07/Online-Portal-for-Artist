'use client';

import { IoIosArrowDown } from "react-icons/io";
import clsx from 'clsx';
import Link from 'next/link';
import jsonData from "@/data/reportedUser.json";

const ReportedUser = () => {
  return (
    <div className="w-full">
     
      <h2 className="mb-8 text-2xl font-black text-white tracking-tight">
        List of Reported Users
      </h2>

     
      <div className="bg-background border-2 border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-primary  border-b-2 border-[#1e293b] text-[11px] uppercase tracking-[0.2em] text-[#f1f5f9]">
              <th className="px-6 py-5 font-black text-center">Id</th>
              <th className="px-6 py-5 font-black">User Name</th>
              <th className="px-6 py-5 font-black text-center">Date</th>
              <th className="px-6 py-5 font-black">Reported by</th>
              <th className="px-6 py-5 font-black">Reason</th>
              <th className="px-6 py-5 font-black text-center">Status</th>
              <th className="px-6 py-5 font-black text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-[#1e293b]">
            {jsonData.slice(0, 5).map((u) => (
              <tr key={u.id} className="group hover:bg-[#0f172a] transition-all">
                
                <td className="px-6 py-5 text-center font-mono text-[11px] text-[#60a5fa] font-bold opacity-80">
                  #{u.id.slice(0, 6).toUpperCase()}
                </td>

          
                <td className="px-6 py-5 text-sm font-black text-white group-hover:text-[#4ade80] transition-colors">
                  {u.user}
                </td>

                
                <td className="px-6 py-5 text-center text-[12px] text-slate-400 font-mono font-normal">
                  {u.reportDate}
                </td>

               
                <td className="px-6 py-5 text-[13px] text-slate-300 font-normal italic tracking-wide">
                  {u.reportedBy}
                </td>

           
                <td className="px-6 py-5 text-[11px] text-slate-500 font-normal max-w-[150px] truncate uppercase tracking-tighter">
                  {u.reason}
                </td>

                
                <td className="px-6 py-5 text-center">
                  <span className={clsx(
                    'px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 inline-block', 
                    {
                      "bg-[#422006] text-[#fbbf24] border-[#78350f]": u.status === "pending",
                      "bg-[#450a0a] text-[#f87171] border-[#7f1d1d]": u.status === "warned" || u.status === "flagged",
                      "bg-[#064e3b] text-[#4ade80] border-[#065f46]": u.status === "success" || u.status === "cleared"
                    }
                  )}>
                    {u.status}
                  </span>
                </td>

                
                <td className="px-6 py-5 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-md transition-all border border-[#58d68d]/30 text-[#58d68d] bg-[#0a0a0a] hover:bg-[#58d68d] hover:text-[#090e0e] hover:border-[#58d68d]">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

         
          <tfoot className="bg-[#0f172a]/30 border-t-2 border-[#1e293b]">
            <tr>
              <td colSpan={7} className="p-0">
                <Link 
                  href="/reports/users" 
                  className="w-full flex items-center gap-3 justify-center py-5 text-[11px] font-black text-slate-500 hover:text-[#4ade80] transition-all uppercase tracking-[0.4em] group"
                >
                  <span>See all security reports</span>
                  <IoIosArrowDown className="text-lg transition-transform group-hover:translate-y-1" />
                </Link>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default ReportedUser;