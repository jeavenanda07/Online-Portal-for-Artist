'use client';

import Link from "next/link";
import { IoGlobeOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdReport } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import BarChart from './Barchart';
import ThreeColTable from './ThreeColsTable';
import ReportedSummary from './ReportedSummary';
import ReportedUser from "@/data/reportedUser.json";

const summaryData = [
  {
    name: "Total Users",
    icon: <AiOutlineUser />,
    countData: "1,320",
    sub: "+12% this month",
    accent: "#4ade80", // High-visibility Neon Green
  },
  {
    name: "Total Artworks",
    icon: <IoGlobeOutline />,
    countData: "53,023",
    sub: "+340 this week",
    accent: "#60a5fa", // High-visibility Blue
  },
  {
    name: "Total Revenue",
    icon: <RiMoneyDollarCircleLine />,
    countData: "$20,232",
    sub: "+8% this month",
    accent: "#facc15", // High-visibility Yellow
  },
  {
    name: "Pending Reports",
    icon: <MdReport />,
    countData: "30",
    sub: "Needs attention",
    accent: "#f87171", // High-visibility Red
  },
];

const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const values = [12, 19, 3, 5, 9, 14, 20, 17, 11, 8, 6, 15];

const Overview = () => {
  return (
    <div className="flex flex-col gap-10 p-2 ">

      {/* Summary Cards - Ginawang solid at makapal ang borders */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <li key={index}>
            <Link href="#" className="block h-full transform transition-transform hover:scale-[1.02]">
              <div className="h-full bg-background border-2 border-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                
                {/* Accent Line sa itaas para sa visibility */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: item.accent }}></div>

                <div className="flex items-center justify-between mb-4">
                   <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-lg"
                    style={{ background: `${item.accent}20`, color: item.accent, border: `1px solid ${item.accent}40` }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-white/50">Live</span>
                </div>

                <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1">
                  {item.name}
                </p>
                
                <p className="text-4xl font-black text-white tracking-tight mb-2">
                  {item.countData}
                </p>

                <p className="text-[12px] font-bold flex items-center gap-1" style={{ color: item.accent }}>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-background border border-current">
                    {item.sub}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-background border-2 border-[#1e293b] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#1e293b] pb-4">
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-wider">Monthly Logins</h4>
              <p className="text-sm text-[#64748b] font-bold">User activity trend for the current year</p>
            </div>
            <span className="text-sm font-black text-[#4ade80] bg-background border border-[#4ade8040] px-4 py-1.5 rounded-full shadow-inner">
              FY 2024
            </span>
          </div>
          <div className="h-[300px] w-full">
            <BarChart labels={labels} values={values} />
          </div>
        </section>

        <section className="bg-background border-2 border-[#1e293b] rounded-2xl p-6 shadow-2xl">
          <div className="mb-8 border-b-2 border-[#1e293b] pb-4">
            <h4 className="text-lg font-black text-white uppercase tracking-wider">Recent Activity</h4>
            <p className="text-sm text-[#64748b] font-bold">Real-time platform event logs</p>
          </div>
          <div className="min-h-[300px]">
             <ThreeColTable />
          </div>
        </section>
      </div>

     
      <div className="grid grid-cols-1 gap-10">
        <div className="p-1 bg-gradient-to-r from-red-500/20 to-transparent rounded-2xl">
          <ReportedSummary jsonData={ReportedUser} header="Reported Users Alert" />
        </div>
        <div className="p-1 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-2xl">
          <ReportedSummary jsonData={ReportedUser} header="Flagged Artworks Gallery" />
        </div>
      </div>
      
    </div>
  );
};

export default Overview;