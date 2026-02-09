interface Props {
  title: string;
  value: string;
  color: "indigo" | "emerald" | "amber" | "rose";
}

const colorMap = {
  indigo: "border-[#6c7aa1] bg-[#f5f6fb] text-[#2a3352]",
  emerald: "border-[#4aa38a] bg-[#f1fbf7] text-[#1f4b41]",
  amber: "border-[#d1a85e] bg-[#fff8eb] text-[#5b3d19]",
  rose: "border-[#cf6b7a] bg-[#fff1f2] text-[#5a1f2a]",
};

export default function StatCard({ title, value, color }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] border ${colorMap[color]}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        {title}
      </p>
      <p className="text-3xl font-semibold mt-2">{value}</p>

      {/* Decorative blur */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/60 rounded-full blur-2xl" />
    </div>
  );
}
