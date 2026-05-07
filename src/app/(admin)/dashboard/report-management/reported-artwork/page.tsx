import clsx from 'clsx';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";
import { PiImageSquareLight } from "react-icons/pi";
import DatePicker from '@/app/components/ui/DatePicker';

interface Report {
  id: string;
  artworkId: string;
  reason: string;
  reportDate: string | Date;
  status: 'pending' | 'warned' | 'cleared' | 'success';
  reportedBy: {
    name: string;
    email: string;
    image?: string;
  };
}

const ReportedArtworkSummary = async () => {
  // Using an empty array as placeholder - matches your logic
  const reports: Report[] = [];

  return (

    <div className="min-h-screen bg-background text-[#d5dbdb] p-8 font-sans">


      <div className="flex items-center justify-between mb-10 px-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#566573] uppercase tracking-[0.2em] mb-1">
            <Link href="/dashboard" className="hover:text-[#58d68d] transition-colors">Dashboard</Link>
            <RiArrowRightSLine className="text-sm opacity-50" />
            <span className="text-[#85929e]">Reported Artwork</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f7f9f9]">Report Management</h1>
        </div>
      </div>


      <div className="w-full bg-primary  border border-white/[0.03] rounded-xl shadow-2xl overflow-hidden">


        <div className="flex justify-between items-center px-8 py-6 border-b border-white/[0.03]">
          <div>
            <h2 className="text-[11px] font-bold text-[#566573] uppercase tracking-[0.25em]">Latest list of reported artworks</h2>
            <p className="text-[13px] text-[#58d68d] font-bold mt-1">
              {reports.length > 0 ? `${reports.length} items flagged` : "No pending reviews"}
            </p>
          </div>
          <DatePicker />
        </div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[900px]">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-[#566573]">
                <th className="px-8 py-4 font-bold">Report Id</th>
                <th className="px-8 py-4 font-bold">Artwork Details</th>
                <th className="px-8 py-4 font-bold">Reported By</th>
                <th className="px-8 py-4 font-bold text-center">Date</th>
                <th className="px-8 py-4 font-bold text-center">Status</th>
                <th className="px-8 py-4 font-bold text-right">Take Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.02]">
              {reports.map((report) => (
                <tr key={report.id} className="group hover:bg-white/[0.01] transition-all duration-200">


                  <td className="px-8 py-5 font-mono text-[11px] text-[#2e4053]">
                    <span className="group-hover:text-[#58d68d] transition-colors">#{report.id?.slice(0, 8)}</span>
                  </td>


                  <td className="px-8 py-5">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-[#1e3b2e]/20 rounded border border-[#58d68d]/10 flex items-center justify-center text-[#58d68d]">
                        <PiImageSquareLight className="text-xl" />
                      </div>
                      <div>
                        <Link href={`/artwork/${report.artworkId}`} className="text-sm font-bold text-[#58d68d] hover:text-white transition-colors">
                          Preview Artwork
                        </Link>
                        <p className="text-[10px] text-[#566573] truncate max-w-[180px] mt-0.5 italic">"{report.reason}"</p>
                      </div>
                    </div>
                  </td>


                  <td className="px-8 py-5">
                    <div className="flex gap-3 items-center">
                      <img
                        src={report.reportedBy?.image || "/default-avatar.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-white/5 grayscale-[0.3] group-hover:grayscale-0 transition-all"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#ebf5fb] leading-none group-hover:text-white">{report.reportedBy?.name}</p>
                        <p className="text-[10px] text-[#566573] mt-1">{report.reportedBy?.email}</p>
                      </div>
                    </div>
                  </td>


                  <td className="px-8 py-5 text-center text-[10px] text-[#566573] font-mono">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>


                  <td className="px-8 py-5 text-center">
                    <span className={clsx(
                      'px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block border',
                      {
                        "bg-[#3b2e1e] text-[#f39c12] border-[#f39c12]/10": report.status === "pending",
                        "bg-[#3b1e1e] text-[#e74c3c] border-[#e74c3c]/10": report.status === "warned",
                        "bg-[#1e3b2e] text-[#58d68d] border-[#58d68d]/10": report.status === "cleared" || report.status === "success"
                      }
                    )}>
                      {report.status}
                    </span>
                  </td>


                  <td className="px-8 py-5 text-right">
                    <button className="text-[9px] font-black text-[#58d68d] bg-[#1e3b2e]/30 border border-[#58d68d]/20 hover:bg-[#58d68d] hover:text-[#090e0e] px-4 py-1.5 rounded transition-all uppercase tracking-[0.2em]">
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          {reports.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-block p-4 rounded-full bg-white/[0.02] mb-4">
                <PiImageSquareLight className="text-4xl text-[#2e4053]" />
              </div>
              <p className="text-[10px] text-[#566573] font-black uppercase tracking-[0.3em]">
                Clean Workspace — No Pending Reports
              </p>
            </div>
          )}
        </div>


        <div className="p-4 bg-white/[0.01] border-t border-white/[0.03] text-center">
          <p className="text-[9px] text-[#2e4053] font-black uppercase tracking-[0.5em]">
            End of list
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportedArtworkSummary;