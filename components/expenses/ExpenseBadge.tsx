export default function ExpenseBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Food: "bg-emerald-100 text-emerald-700",
    Transport: "bg-indigo-100 text-indigo-700",
    Shopping: "bg-amber-100 text-amber-700",
    Bills: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[label] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
}
