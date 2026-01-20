"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Food", value: 4000 },
  { name: "Transport", value: 2200 },
  { name: "Shopping", value: 1800 },
  { name: "Bills", value: 2600 },
];

// const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

export default function CategoryPieChart() {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow">
      <h3  className="font-semibold mb-4 text-gray-800">Expense by Category</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={70} paddingAngle={5}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
