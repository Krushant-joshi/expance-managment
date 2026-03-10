interface Props {
  title: string;
  value: string;
  color: "indigo" | "emerald" | "amber" | "rose";
}

const accentMap: Record<Props["color"], string> = {
  indigo: "#818cf8",
  emerald: "#34d399",
  amber: "#d4af37",
  rose: "#fb7185",
};

export default function StatCard({ title, value, color }: Props) {
  const accent = accentMap[color];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
    >
      <div
        className="mb-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          borderColor: `${accent}66`,
          backgroundColor: `${accent}1f`,
          color: accent,
        }}
      >
        {title}
      </div>
      <p className="text-3xl font-semibold mt-2">{value}</p>

      {/* Decorative blur */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
