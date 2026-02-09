"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ExpenseLineChart from "@/components/dashboard/ExpenseLineChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";

type Expense = {
  ExpenseID: number;
  ExpenseDate: string;
  Amount: number;
  ExpenseDetail?: string;
  categories?: { CategoryName: string };
};

export default function AdminDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch(() => setExpenses([]));
  }, []);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.Amount || 0), 0);
    const now = new Date();
    const thisMonth = expenses.filter((e) => {
      const d = new Date(e.ExpenseDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const monthTotal = thisMonth.reduce(
      (sum, e) => sum + Number(e.Amount || 0),
      0,
    );
    const uniqueDays = new Set(
      thisMonth.map((e) => new Date(e.ExpenseDate).toDateString()),
    ).size;
    const avgPerDay = uniqueDays > 0 ? Math.round(monthTotal / uniqueDays) : 0;
    const categories = new Set(
      expenses
        .map((e) => e.categories?.CategoryName)
        .filter((c): c is string => Boolean(c)),
    ).size;

    return { total, monthTotal, avgPerDay, categories };
  }, [expenses]);

  const lineData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      return {
        key,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        total: 0,
      };
    });

    const map = new Map(months.map((m) => [m.key, m]));
    expenses.forEach((e) => {
      const d = new Date(e.ExpenseDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      const bucket = map.get(key);
      if (bucket) bucket.total += Number(e.Amount || 0);
    });

    return months.map((m) => ({ month: m.label, expense: m.total }));
  }, [expenses]);

  const pieData = useMemo(() => {
    const totals = new Map<string, number>();
    expenses.forEach((e) => {
      const name = e.categories?.CategoryName || "Uncategorized";
      totals.set(name, (totals.get(name) || 0) + Number(e.Amount || 0));
    });
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [expenses]);

  const recent = useMemo(() => {
    return expenses
      .slice(0, 5)
      .map((e) => ({
        title: e.ExpenseDetail || "Expense",
        date: new Date(e.ExpenseDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        category: e.categories?.CategoryName || "N/A",
        amount: Number(e.Amount || 0).toLocaleString(),
      }));
  }, [expenses]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Executive Summary
        </p>
        <h1 className="text-3xl font-semibold text-[var(--foreground)]">
          Expense Dashboard
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Track, analyze and control your spending with clarity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Expense"
          value={stats.total.toLocaleString()}
          color="indigo"
        />
        <StatCard
          title="This Month"
          value={stats.monthTotal.toLocaleString()}
          color="emerald"
        />
        <StatCard
          title="Avg / Day"
          value={stats.avgPerDay.toLocaleString()}
          color="amber"
        />
        <StatCard
          title="Categories"
          value={stats.categories.toString()}
          color="rose"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseLineChart data={lineData} />
        </div>
        <CategoryPieChart data={pieData} />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses items={recent} />
    </div>
  );
}
