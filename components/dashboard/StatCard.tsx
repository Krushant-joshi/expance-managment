import {
  Activity,
  BarChart3,
  CalendarRange,
  HandCoins,
  LucideIcon,
  PieChart,
  Scale,
  Wallet,
} from "lucide-react";

interface Props {
  title: string;
  value: string;
  color: "indigo" | "emerald" | "amber" | "rose";
  subtitle?: string;
  icon?: LucideIcon;
}

const accentMap: Record<Props["color"], string> = {
  indigo: "#818cf8",
  emerald: "#34d399",
  amber: "#d4af37",
  rose: "#fb7185",
};

function getCardIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("expense")) return Wallet;
  if (normalized.includes("income")) return HandCoins;
  if (normalized.includes("month")) return CalendarRange;
  if (normalized.includes("category")) return PieChart;
  if (
    normalized.includes("balance") ||
    normalized.includes("saving") ||
    normalized.includes("net")
  ) {
    return Scale;
  }
  if (normalized.includes("transaction") || normalized.includes("activity")) {
    return Activity;
  }

  return BarChart3;
}

export default function StatCard({
  title,
  value,
  color,
  subtitle = "ExpanceFlow insight",
  icon,
}: Props) {
  const accent = accentMap[color];
  const Icon = icon || getCardIcon(title);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div
        className="absolute -right-5 -top-5 h-28 w-28 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}45 0%, transparent 72%)`,
        }}
      />
      <Icon
        className="absolute -bottom-5 right-3 h-24 w-24"
        style={{ color: `${accent}1f` }}
        strokeWidth={1.4}
      />

      <div
        className="relative z-10 mb-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          borderColor: `${accent}66`,
          backgroundColor: `${accent}1f`,
          color: accent,
        }}
      >
        {title}
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mt-2 text-3xl font-semibold leading-tight">{value}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
        <div
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            borderColor: `${accent}40`,
            backgroundColor: `${accent}14`,
            color: accent,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}
