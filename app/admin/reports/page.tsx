"use client";

import StatCard from "@/components/dashboard/StatCard";
import { useEffect, useMemo, useState } from "react";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expenses, setExpenses] = useState<
    { ExpenseDate: string; Amount: number; categories?: { CategoryName: string } }[]
  >([]);

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch(() => setExpenses([]));
  }, []);

  const filteredExpenses = useMemo(() => {
    if (!startDate && !endDate) return expenses;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return expenses.filter((e) => {
      const d = new Date(e.ExpenseDate);
      const afterStart = start ? d >= start : true;
      const beforeEnd = end ? d <= end : true;
      return afterStart && beforeEnd;
    });
  }, [expenses, startDate, endDate]);

  const trendData = useMemo(() => {
    const buckets = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const d = new Date(e.ExpenseDate);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      buckets.set(label, (buckets.get(label) || 0) + Number(e.Amount || 0));
    });
    const order = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return order
      .filter((m) => buckets.has(m))
      .map((m) => ({ month: m, expense: buckets.get(m) || 0 }));
  }, [filteredExpenses]);

  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.Amount || 0),
    0,
  );
  const avgMonth =
    trendData.length > 0 ? Math.round(totalExpense / trendData.length) : 0;

  const categoryData = useMemo(() => {
    const totals = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const name = e.categories?.CategoryName || "Uncategorized";
      totals.set(name, (totals.get(name) || 0) + Number(e.Amount || 0));
    });
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [filteredExpenses]);

  const topCategory =
    categoryData.length > 0 ? categoryData[0].name : "N/A";

  const transactions = filteredExpenses.length;

  return (
    <div className="space-y-10 text-[var(--foreground)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Reports
          </h1>
          <p className="text-[var(--muted)]">Analyze your expense patterns</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 shadow">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface)] rounded-xl p-4 flex gap-4 shadow-sm items-center border border-[var(--border)]">
        <Calendar size={18} className="text-[var(--muted)]" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--surface)] text-[var(--foreground)]"
        />
        <span className="text-[var(--muted-2)]">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--surface)] text-[var(--foreground)]"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Expense"
          value={totalExpense.toLocaleString()}
          color="indigo"
        />
        <StatCard
          title="Average / Month"
          value={avgMonth.toLocaleString()}
          color="emerald"
        />
        <StatCard title="Highest Category" value={topCategory} color="amber" />
        <StatCard title="Transactions" value={transactions.toString()} color="rose" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Trend */}
        <div className="col-span-2 bg-[var(--surface)] rounded-2xl p-6 shadow border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-[var(--foreground)]">
            Expense Trend
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#9f7e54"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[var(--surface)] rounded-2xl p-6 shadow border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-[var(--foreground)]">
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
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

const COLORS = ["#9f7e54", "#3b7c6e", "#b45352", "#1f2937"];
