"use client";

import { useEffect, useState } from "react";
import { Calendar, Download, Filter, Search, TrendingUp, Plus } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Income = {
  IncomeID: number;
  IncomeDate: string;
  Amount: number;
  IncomeDetail?: string;
  categories?: {
    CategoryName: string;
  };
  peoples?: {
    PeopleName: string;
  };
};

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchIncomes = async () => {
    try {
      const res = await fetch("/api/incomes");
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this income?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/incomes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      alert("Deleted successfully");
      fetchIncomes();
    } catch {
      alert("Delete failed");
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
  const now = new Date();
  const thisMonth = incomes.filter((i) => {
    const d = new Date(i.IncomeDate);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const monthTotal = thisMonth.reduce((sum, i) => sum + Number(i.Amount), 0);
  const avgPerDay =
    thisMonth.length > 0 ? Math.round(monthTotal / thisMonth.length) : 0;

  const filteredBySearch = incomes.filter((i) =>
    (i.IncomeDetail || "Income").toLowerCase().includes(search.toLowerCase())
  );

  const dateKey = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filtered = filteredBySearch.filter((i) => {
    const matchesCategory =
      !selectedCategory || i.categories?.CategoryName === selectedCategory;
    const matchesDate = !selectedDate || dateKey(i.IncomeDate) === selectedDate;
    return matchesCategory && matchesDate;
  });

  const categoryOptions = Array.from(
    new Set(
      incomes
        .map((i) => i.categories?.CategoryName)
        .filter((c): c is string => Boolean(c))
    )
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleExport = () => {
    if (filtered.length === 0) {
      alert("No filtered incomes to export");
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("All Incomes Report", 40, 40);

    const tableBody = filtered.map((i) => [
      `#${i.IncomeID}`,
      i.IncomeDetail || "Income",
      formatDate(i.IncomeDate),
      i.categories?.CategoryName || "N/A",
      i.peoples?.PeopleName || "N/A",
      `₹ ${Number(i.Amount).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["ID", "Title", "Date", "Category", "Received From", "Amount"]],
      body: tableBody,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    doc.save("incomes.pdf");
  };

  return (
    <div className="min-h-screen space-y-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              All Incomes
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Manage and track all your incomes
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/incomes/add"
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 shadow-sm transition-all hover:bg-[var(--surface-2)]"
            >
              <Plus size={16} />
              Add Income
            </Link>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-[var(--accent-contrast)] shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition-all hover:opacity-90"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Total Income</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <TrendingUp size={18} className="text-[var(--muted)]" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            ₹ {totalIncome.toLocaleString()}
          </h2>
        </div>

        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">This Month</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <Calendar size={18} className="text-[var(--muted)]" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            ₹ {monthTotal.toLocaleString()}
          </h2>
        </div>

        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Avg / Day</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <TrendingUp size={18} className="text-[var(--muted)]" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            ₹ {avgPerDay}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-2xl">
          <Search
            size={18}
            className="absolute top-3.5 left-3 text-[var(--muted-2)]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search income by title..."
            className="h-11 pl-10 pr-3 w-full border border-[var(--border)] rounded-full focus:ring-2 focus:ring-[var(--ring)] outline-none bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted-2)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:ml-auto xl:flex xl:flex-wrap xl:items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 border border-[var(--border)] rounded-full px-4 text-sm bg-[var(--surface)] text-[var(--foreground)]"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-11 border border-[var(--border)] rounded-full px-4 text-sm bg-[var(--surface)] text-[var(--foreground)]"
          />

          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedDate("");
              setSearch("");
            }}
            className="h-11 flex items-center gap-2 border border-[var(--border)] rounded-full px-4 text-sm hover:bg-[var(--surface-2)]"
          >
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-[var(--muted)]">Loading...</p>
        ) : (
          <>
          <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                  INCOME DETAILS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                  DATE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                  CATEGORY
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                  RECEIVED FROM
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide">
                  AMOUNT
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold tracking-wide">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.IncomeID}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition"
                >
                  <td className="px-4 py-4 align-middle">
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">
                        {item.IncomeDetail || "Income"}
                      </p>
                      <p className="text-xs text-[var(--muted-2)]">
                        ID: #{item.IncomeID}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">{formatDate(item.IncomeDate)}</td>
                  <td className="px-4 py-4 align-middle">
                    {item.categories?.CategoryName || "N/A"}
                  </td>
                  <td className="px-4 py-4 align-middle">
                    {item.peoples?.PeopleName || "N/A"}
                  </td>
                  <td className="px-4 py-4 align-middle text-right font-semibold text-[var(--foreground)]">
                    ₹ {Number(item.Amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/incomes/edit/${item.IncomeID}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fbf4ea] text-[#8c6d3d] hover:bg-[#f6e8d5] transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.IncomeID)}
                        className="p-2 rounded-full hover:bg-rose-500/10 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {filtered.map((item) => (
              <article
                key={item.IncomeID}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--foreground)]">
                      {item.IncomeDetail || "Income"}
                    </p>
                    <p className="text-xs text-[var(--muted-2)]">ID: #{item.IncomeID}</p>
                  </div>
                  <p className="text-right text-sm font-semibold text-[var(--foreground)]">
                    Rs. {Number(item.Amount).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Date</p>
                    <p className="mt-1 text-[var(--muted)]">{formatDate(item.IncomeDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Category</p>
                    <p className="mt-1 text-[var(--muted)]">
                      {item.categories?.CategoryName || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Received From</p>
                    <p className="mt-1 text-[var(--muted)]">{item.peoples?.PeopleName || "N/A"}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/incomes/edit/${item.IncomeID}`}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#fbf4ea] px-3 py-2 text-[#8c6d3d] transition-colors hover:bg-[#f6e8d5]"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.IncomeID)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-red-600"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
