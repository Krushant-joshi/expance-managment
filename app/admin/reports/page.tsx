"use client";

import StatCard from "@/components/dashboard/StatCard";
import { useEffect, useMemo, useState } from "react";
import { Download, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [incomes, setIncomes] = useState<
    { IncomeDate: string; Amount: number; categories?: { CategoryName: string } }[]
  >([]);

  const getStartOfDay = (value: string) => {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getEndOfDay = (value: string) => {
    const d = new Date(value);
    d.setHours(23, 59, 59, 999);
    return d;
  };

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

  const filteredExpenses = useMemo(() => {
    if (!startDate && !endDate) return expenses;
    const start = startDate ? getStartOfDay(startDate) : null;
    const end = endDate ? getEndOfDay(endDate) : null;
    return expenses.filter((e) => {
      const d = new Date(e.ExpenseDate);
      const afterStart = start ? d >= start : true;
      const beforeEnd = end ? d <= end : true;
      return afterStart && beforeEnd;
    });
  }, [expenses, startDate, endDate]);

  const filteredIncomes = useMemo(() => {
    if (!startDate && !endDate) return incomes;
    const start = startDate ? getStartOfDay(startDate) : null;
    const end = endDate ? getEndOfDay(endDate) : null;
    return incomes.filter((i) => {
      const d = new Date(i.IncomeDate);
      const afterStart = start ? d >= start : true;
      const beforeEnd = end ? d <= end : true;
      return afterStart && beforeEnd;
    });
  }, [incomes, startDate, endDate]);

  const expenseTrendData = useMemo(() => {
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

  const incomeTrendData = useMemo(() => {
    const buckets = new Map<string, number>();
    filteredIncomes.forEach((i) => {
      const d = new Date(i.IncomeDate);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      buckets.set(label, (buckets.get(label) || 0) + Number(i.Amount || 0));
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
      .map((m) => ({ month: m, income: buckets.get(m) || 0 }));
  }, [filteredIncomes]);

  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.Amount || 0),
    0,
  );
  const totalIncome = filteredIncomes.reduce(
    (sum, i) => sum + Number(i.Amount || 0),
    0,
  );
  const expenseAvgMonth =
    expenseTrendData.length > 0
      ? Math.round(totalExpense / expenseTrendData.length)
      : 0;
  const incomeAvgMonth =
    incomeTrendData.length > 0
      ? Math.round(totalIncome / incomeTrendData.length)
      : 0;

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

  const incomeCategoryData = useMemo(() => {
    const totals = new Map<string, number>();
    filteredIncomes.forEach((i) => {
      const name = i.categories?.CategoryName || "Uncategorized";
      totals.set(name, (totals.get(name) || 0) + Number(i.Amount || 0));
    });
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [filteredIncomes]);

  const topIncomeCategory =
    incomeCategoryData.length > 0 ? incomeCategoryData[0].name : "N/A";

  const transactions = filteredExpenses.length;
  const incomeTransactions = filteredIncomes.length;
  const netBalance = totalIncome - totalExpense;

  const handleExportReport = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    doc.setFontSize(16);
    doc.text("Finance Report", 40, 40);

    doc.setFontSize(10);
    doc.text(
      `Date Filter: ${startDate || "All"} to ${endDate || "All"}`,
      40,
      60
    );

    autoTable(doc, {
      startY: 80,
      head: [["Metric", "Value"]],
      body: [
        ["Total Expense", totalExpense.toLocaleString()],
        ["Total Income", totalIncome.toLocaleString()],
        ["Net Balance", netBalance.toLocaleString()],
        ["Expense Transactions", transactions.toString()],
        ["Income Transactions", incomeTransactions.toString()],
        [
          "Savings Rate",
          totalIncome > 0
            ? `${Math.round((netBalance / totalIncome) * 100)}%`
            : "0%",
        ],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    const expenseRows = filteredExpenses.map((e) => [
      new Date(e.ExpenseDate).toLocaleDateString("en-IN"),
      e.categories?.CategoryName || "Uncategorized",
      Number(e.Amount || 0).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY
        ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
            ?.finalY || 120) + 20
        : 120,
      head: [["Expense Date", "Category", "Amount"]],
      body: expenseRows.length > 0 ? expenseRows : [["-", "-", "0"]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [159, 126, 84] },
    });

    const incomeRows = filteredIncomes.map((i) => [
      new Date(i.IncomeDate).toLocaleDateString("en-IN"),
      i.categories?.CategoryName || "Uncategorized",
      Number(i.Amount || 0).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY
        ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
            ?.finalY || 200) + 20
        : 200,
      head: [["Income Date", "Category", "Amount"]],
      body: incomeRows.length > 0 ? incomeRows : [["-", "-", "0"]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 124, 110] },
    });

    doc.save("finance-report.pdf");
  };

  return (
    <div className="space-y-10 text-[var(--foreground)]">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Reports
          </h1>
          <p className="text-[var(--muted)]">
            Analyze your expense and income patterns
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition-all"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Expense"
          value={totalExpense.toLocaleString()}
          color="indigo"
        />
        <StatCard
          title="Expense Avg / Month"
          value={expenseAvgMonth.toLocaleString()}
          color="emerald"
        />
        <StatCard title="Expense Top Category" value={topCategory} color="amber" />
        <StatCard
          title="Expense Transactions"
          value={transactions.toString()}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={totalIncome.toLocaleString()}
          color="emerald"
        />
        <StatCard
          title="Income Avg / Month"
          value={incomeAvgMonth.toLocaleString()}
          color="indigo"
        />
        <StatCard
          title="Income Top Category"
          value={topIncomeCategory}
          color="amber"
        />
        <StatCard
          title="Income Transactions"
          value={incomeTransactions.toString()}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Net Balance" value={netBalance.toLocaleString()} color="amber" />
        <StatCard
          title="Total Activity"
          value={(transactions + incomeTransactions).toString()}
          color="indigo"
        />
        <StatCard
          title="Savings Rate"
          value={
            totalIncome > 0
              ? `${Math.round((netBalance / totalIncome) * 100)}%`
              : "0%"
          }
          color="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow sm:p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4 text-[var(--foreground)]">
            Expense Trend
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={expenseTrendData}>
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
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow sm:p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow sm:p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4 text-[var(--foreground)]">
            Income Trend
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={incomeTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#3b7c6e"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow sm:p-6">
          <h3 className="font-semibold mb-4 text-[var(--foreground)]">
            Income Category Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={incomeCategoryData}
                dataKey="value"
                innerRadius={70}
                paddingAngle={5}
              >
                {incomeCategoryData.map((_, i) => (
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
