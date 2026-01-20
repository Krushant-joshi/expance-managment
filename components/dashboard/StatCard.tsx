interface Props {
  title: string;
  value: string;
  color: "indigo" | "emerald" | "amber" | "rose";
}

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-400 to-amber-500",
  rose: "from-rose-500 to-rose-600",
};

export default function StatCard({ title, value, color }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${colorMap[color]}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>

      {/* Decorative blur */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
    </div>
  );
}
