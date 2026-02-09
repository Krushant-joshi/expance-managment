"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = { month: string; expense: number };

export default function ExpenseLineChart({ data = [] }: { data?: Point[] }) {
  return (
    <div className="bg-[var(--surface)]/80 backdrop-blur rounded-2xl p-6 border border-[var(--border)] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Trends
        </p>
        <h3 className="font-semibold text-[var(--foreground)]">
          Monthly Expenses
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#9f7e54"
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
