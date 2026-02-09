"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#9f7e54", "#3b7c6e", "#b45352", "#1f2937"];
type Slice = { name: string; value: number };

export default function CategoryPieChart({ data = [] }: { data?: Slice[] }) {
  return (
    <div className="bg-[var(--surface)]/80 backdrop-blur rounded-2xl p-6 border border-[var(--border)] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Distribution
        </p>
        <h3 className="font-semibold text-[var(--foreground)]">
          Expense by Category
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={70} paddingAngle={5}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
