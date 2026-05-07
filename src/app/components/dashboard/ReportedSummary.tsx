"use client";

import { useState } from "react";
import { MdOutlineOpenInNew } from "react-icons/md";
import Link from "next/link";

interface ReportedItem {
  id?: string | number;
  username?: string;
  name?: string;
  reason?: string;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

interface ReportedSummaryProps {
  jsonData: ReportedItem[];
  header: string;
}

const statusStyles: Record<string, string> = {
  pending:  "bg-[#2a2510] text-[#f0a020]",
  resolved: "bg-[#0d1f0d] text-[#39ff6a]",
  flagged:  "bg-[#2a1010] text-[#ff6b6b]",
  banned:   "bg-[#2a1010] text-[#ff4444]",
};

export default function ReportedSummary({ jsonData, header }: ReportedSummaryProps) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(jsonData.length / perPage);
  const visible = jsonData.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-background border border-[#1a2e1a] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2e1a]">
        <div>
          <h4 className="text-sm font-semibold text-[#c8e6c8]">{header}</h4>
          <p className="text-xs text-[#3a5c3a] mt-0.5">{jsonData.length} total entries</p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1.5 text-xs text-[#39ff6a] hover:text-[#6aff8a] transition-colors"
        >
          View all <MdOutlineOpenInNew className="text-sm" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#0f1a0f]">
              {["#", "User", "Reason", "Status", "Date"].map((col) => (
                <th
                  key={col}
                  className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a5c3a]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => {
              const status = (item.status ?? "pending").toLowerCase();
              return (
                <tr
                  key={i}
                  className="border-b border-[#0a140a] hover:bg-[#0d1a0d] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-[#3a5c3a] font-mono">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-[#c8e6c8]">
                    {item.username ?? item.name ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6b8f6b] max-w-[200px] truncate">
                    {item.reason ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                        statusStyles[status] ?? "bg-[#1a2e1a] text-[#6b8f6b]"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#3a5c3a]">
                    {item.date ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a2e1a]">
          <p className="text-xs text-[#3a5c3a]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs rounded-md border border-[#1a2e1a] text-[#6b8f6b]
                hover:border-[#2a4a2a] hover:text-[#c8e6c8] disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs rounded-md border border-[#1a2e1a] text-[#6b8f6b]
                hover:border-[#2a4a2a] hover:text-[#c8e6c8] disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}