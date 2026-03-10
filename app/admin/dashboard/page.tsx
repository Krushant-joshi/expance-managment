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

type Income = {
  IncomeID: number;
  IncomeDate: string;
  Amount: number;
  IncomeDetail?: string;
  categories?: { CategoryName: string };
};

export default function AdminDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/expenses")
        .then((res) => res.json())
        .catch(() => []),
      fetch("/api/incomes")
        .then((res) => res.json())
        .catch(() => []),
    ])
      .then(([expenseData, incomeData]) => {
        setExpenses(expenseData);
        setIncomes(incomeData);
      })
      .catch(() => {
        setExpenses([]);
        setIncomes([]);
      });
  }, []);

  const stats = useMemo(() => {
    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.Amount || 0),
      0
    );
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount || 0), 0);
    const now = new Date();
    const thisMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.ExpenseDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const thisMonthIncomes = incomes.filter((i) => {
      const d = new Date(i.IncomeDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const monthExpense = thisMonthExpenses.reduce(
      (sum, e) => sum + Number(e.Amount || 0),
      0
    );
    const monthIncome = thisMonthIncomes.reduce(
      (sum, i) => sum + Number(i.Amount || 0),
      0
    );
    const netBalance = totalIncome - totalExpense;

    return {
      totalExpense,
      totalIncome,
      monthExpense,
      monthIncome,
      netBalance,
    };
  }, [expenses, incomes]);

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

  const incomeLineData = useMemo(() => {
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
    incomes.forEach((i) => {
      const d = new Date(i.IncomeDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      const bucket = map.get(key);
      if (bucket) bucket.total += Number(i.Amount || 0);
    });

    return months.map((m) => ({ month: m.label, income: m.total }));
  }, [incomes]);

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

  const incomePieData = useMemo(() => {
    const totals = new Map<string, number>();
    incomes.forEach((i) => {
      const name = i.categories?.CategoryName || "Uncategorized";
      totals.set(name, (totals.get(name) || 0) + Number(i.Amount || 0));
    });
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [incomes]);

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

  const recentIncomes = useMemo(() => {
    return incomes
      .slice(0, 5)
      .map((i) => ({
        title: i.IncomeDetail || "Income",
        date: new Date(i.IncomeDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        category: i.categories?.CategoryName || "N/A",
        amount: Number(i.Amount || 0).toLocaleString(),
      }));
  }, [incomes]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Executive Summary
        </p>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Finance Dashboard
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Track income, expense and net balance in one place.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Expense"
          value={stats.totalExpense.toLocaleString()}
          color="indigo"
        />
        <StatCard
          title="Total Income"
          value={stats.totalIncome.toLocaleString()}
          color="emerald"
        />
        <StatCard
          title="Net Balance"
          value={stats.netBalance.toLocaleString()}
          color="amber"
        />
        <StatCard
          title="This Month (Net)"
          value={(stats.monthIncome - stats.monthExpense).toLocaleString()}
          color="rose"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseLineChart
            data={lineData}
            title="Monthly Expenses"
            subtitle="Expense Trend"
            dataKey="expense"
            lineColor="#9f7e54"
          />
        </div>
        <CategoryPieChart
          data={pieData}
          title="Expense by Category"
          subtitle="Expense Distribution"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseLineChart
            data={incomeLineData}
            title="Monthly Incomes"
            subtitle="Income Trend"
            dataKey="income"
            lineColor="#3b7c6e"
          />
        </div>
        <CategoryPieChart
          data={incomePieData}
          title="Income by Category"
          subtitle="Income Distribution"
        />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses items={recent} />
      <RecentExpenses items={recentIncomes} heading="Recent Incomes" />
    </div>
  );
}
