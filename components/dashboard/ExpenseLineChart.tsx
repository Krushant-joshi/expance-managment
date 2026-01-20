"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", expense: 1200 },
  { month: "Feb", expense: 2100 },
  { month: "Mar", expense: 800 },
  { month: "Apr", expense: 1600 },
  { month: "May", expense: 2400 },
  { month: "Jun", expense: 1900 },
];

export default function ExpenseLineChart() {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow">
      <h3 className="font-semibold mb-4 text-gray-800">Monthly Expenses</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#6366F1"
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
