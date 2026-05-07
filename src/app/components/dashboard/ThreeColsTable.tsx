"use client";

const recentActivity = [
  { user: "kawaii_art", action: "Uploaded artwork", time: "2m ago", status: "new" },
  { user: "shade.ink", action: "Commission request", time: "15m ago", status: "pending" },
  { user: "vex_draws", action: "Reported a post", time: "1h ago", status: "flagged" },
  { user: "luna.pixels", action: "Sale completed", time: "2h ago", status: "success" },
  { user: "toriv_art", action: "Account flagged", time: "3h ago", status: "flagged" },
  { user: "inkblot99", action: "Uploaded artwork", time: "5h ago", status: "new" },
];

const statusStyles: Record<string, string> = {
  new:     "bg-[#1a2e1a] text-[#39ff6a]",
  pending: "bg-[#2a2510] text-[#f0a020]",
  flagged: "bg-[#2a1010] text-[#ff6b6b]",
  success: "bg-[#0d1f0d] text-[#39ff6a]",
};

export default function ThreeColTable() {
  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="grid grid-cols-3 pb-2 border-b border-[#1a2e1a] mb-1">
        {["User", "Action", "Status"].map((h) => (
          <span key={h} className="text-[10px] font-semibold uppercase tracking-widest text-[#3a5c3a]">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {recentActivity.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-3 items-center py-2.5 border-b border-[#0f1a0f]
            hover:bg-[#0d1a0d] transition-colors rounded-md px-1 -mx-1"
        >
          <span className="text-xs font-medium text-[#c8e6c8] truncate">{row.user}</span>
          <span className="text-xs text-[#6b8f6b] truncate">{row.action}</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit capitalize ${statusStyles[row.status]}`}
          >
            {row.status}
          </span>
        </div>
      ))}
    </div>
  );
}