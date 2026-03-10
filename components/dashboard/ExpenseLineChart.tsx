"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = { month: string; [key: string]: string | number };

export default function ExpenseLineChart({
  data = [],
  title = "Monthly Expenses",
  subtitle = "Trends",
  dataKey = "expense",
  lineColor = "#9f7e54",
}: {
  data?: Point[];
  title?: string;
  subtitle?: string;
  dataKey?: string;
  lineColor?: string;
}) {
  return (
    <div className="bg-[var(--surface)]/80 backdrop-blur rounded-2xl p-6 border border-[var(--border)] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          {subtitle}
        </p>
        <h3 className="font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={lineColor}
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
