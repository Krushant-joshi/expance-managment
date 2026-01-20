"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Download, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ReportsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your expense patterns</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm items-center">
        <Calendar size={18} className="text-gray-500" />
        <input type="date" className="border rounded-lg px-3 py-2 text-sm" />
        <span className="text-gray-400">to</span>
        <input type="date" className="border rounded-lg px-3 py-2 text-sm" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Expense" value="₹24,800" color="indigo" />
        <StatCard title="Average / Month" value="₹4,130" color="emerald" />
        <StatCard title="Highest Category" value="Food" color="amber" />
        <StatCard title="Transactions" value="38" color="rose" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Trend */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4 text-gray-800">Expense Trend</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#6366F1"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4 text-gray-800">
            Category Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={70}
                paddingAngle={5}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* SUMMARY CARD */
function ReportCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow">
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

/* DUMMY DATA */
const trendData = [
  { month: "Jan", expense: 3200 },
  { month: "Feb", expense: 4200 },
  { month: "Mar", expense: 2800 },
  { month: "Apr", expense: 5100 },
  { month: "May", expense: 4600 },
  { month: "Jun", expense: 4900 },
];

const categoryData = [
  { name: "Food", value: 8200 },
  { name: "Transport", value: 4300 },
  { name: "Shopping", value: 3800 },
  { name: "Bills", value: 4500 },
];

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];
