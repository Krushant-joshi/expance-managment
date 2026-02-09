"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Search,
  TrendingUp,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================================
   Types
================================ */
type Expense = {
  ExpenseID: number;
  ExpenseDate: string;
  Amount: number;

  ExpenseDetail?: string;

  categories?: {
    CategoryName: string;
  };
  PaymentMethod?: string;

  peoples?: {
    PeopleName: string;
  };
};
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const categoryBadge = (_name?: string) =>
    "bg-[var(--surface-2)] text-[var(--foreground)] border-[var(--border)]";

  const categoryInitial = (name?: string) =>
    (name || "Expense").trim().charAt(0).toUpperCase();

  /* ================================
     Fetch Expenses
  ================================ */
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();

      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this expense?");

    if (!ok) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      alert("Deleted successfully");

      // Reload list
      fetchExpenses();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================================
     Calculations
  ================================ */

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

  const now = new Date();

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.ExpenseDate);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const monthTotal = thisMonth.reduce((sum, e) => sum + Number(e.Amount), 0);

  const avgPerDay =
    thisMonth.length > 0 ? Math.round(monthTotal / thisMonth.length) : 0;

  /* ================================
     Filter
  ================================ */

  const filteredExpenses = expenses.filter((e) =>
    e.ExpenseDetail?.toLowerCase().includes(search.toLowerCase()),
  );

  const dateKey = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filtered = filteredExpenses.filter((e) => {
    const matchesCategory =
      !selectedCategory ||
      e.categories?.CategoryName === selectedCategory;
    const matchesDate = !selectedDate || dateKey(e.ExpenseDate) === selectedDate;
    return matchesCategory && matchesDate;
  });

  const categoryOptions = Array.from(
    new Set(
      expenses
        .map((e) => e.categories?.CategoryName)
        .filter((c): c is string => Boolean(c)),
    ),
  );

  /* ================================
     Helpers
  ================================ */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleExport = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    doc.setFontSize(16);
    doc.text("All Expenses Report", 40, 40);

    const tableBody = expenses.map((e) => [
      `#${e.ExpenseID}`,
      e.ExpenseDetail || "Expense",
      formatDate(e.ExpenseDate),
      e.categories?.CategoryName || "N/A",
      e.PaymentMethod || "N/A",
      `INR ${Number(e.Amount).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["ID", "Title", "Date", "Category", "Payment", "Amount"]],
      body: tableBody,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    doc.save("expenses.pdf");
  };

  /* ================================
     UI
  ================================ */

  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
      {/* ================= Header ================= */}

      <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              All Expenses
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Manage and track all your expenses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2 rounded-xl hover:opacity-90 shadow-sm"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ================= Stats ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total */}

        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Total Expense</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <TrendingUp size={18} className="text-[var(--muted)]" />
            </div>
          </div>

          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            INR {totalExpense.toLocaleString()}
          </h2>

          <p className="text-xs mt-2 text-[var(--muted)]">
            +12% from last month
          </p>
        </div>

        {/* Month */}

        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">This Month</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <Calendar size={18} className="text-[var(--muted)]" />
            </div>
          </div>

          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            INR {monthTotal.toLocaleString()}
          </h2>

          <p className="text-xs mt-2 text-[var(--muted)]">
            +8% from last month
          </p>
        </div>

        {/* Avg */}

        <div className="bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-2xl shadow-sm border border-[var(--border)] min-h-[140px]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Avg / Day</p>
            <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <TrendingUp size={18} className="text-[var(--muted)]" />
            </div>
          </div>

          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            INR {avgPerDay}
          </h2>

          <p className="text-xs mt-2 text-[var(--muted)]">
            +5% from last month
          </p>
        </div>
      </div>

      {/* ================= Filters ================= */}

      <div className="bg-[var(--surface)] p-4 rounded-2xl shadow-sm border border-[var(--border)] flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 md:max-w-2xl">
          <Search
            size={18}
            className="absolute top-3.5 left-3 text-[var(--muted-2)]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses by title..."
            className="h-11 pl-10 pr-3 w-full border border-[var(--border)] rounded-full focus:ring-2 focus:ring-[var(--ring)] outline-none bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted-2)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
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

      {/* ================= Table ================= */}

      <div className="bg-[var(--surface)] rounded-2xl shadow-sm border border-[var(--border)] overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-[var(--muted)]">Loading...</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                    EXPENSE DETAILS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                    DATE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                    CATEGORY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">
                    PAYMENT
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
                {filtered.map((item, index) => (
                  <tr
                    key={item.ExpenseID}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition"
                  >
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)]">
                          {categoryInitial(item.categories?.CategoryName)}
                        </div>

                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {item.ExpenseDetail || "Expense"}
                          </p>
                          <p className="text-xs text-[var(--muted-2)]">
                            ID: #{item.ExpenseID}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Calendar size={14} />
                        {formatDate(item.ExpenseDate)}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${categoryBadge(item.categories?.CategoryName)}`}
                      >
                        {item.categories?.CategoryName || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        {item.PaymentMethod === "Card" && (
                          <CreditCard size={14} />
                        )}
                        {item.PaymentMethod === "UPI" && (
                          <Smartphone size={14} />
                        )}
                        {item.PaymentMethod === "Cash" && (
                          <Banknote size={14} />
                        )}
                        {item.PaymentMethod === "Bank" && (
                          <Banknote size={14} />
                        )}

                        <span className="text-sm">
                          {item.PaymentMethod || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle text-right font-semibold text-[var(--foreground)]">
                      INR {Number(item.Amount).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* EDIT */}
                        <Link
                          href={`/admin/expenses/edit/${item.ExpenseID}`}
                          className="p-2 rounded-full hover:bg-[var(--surface-2)] text-blue-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(item.ExpenseID)}
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

            {/* ================= Footer ================= */}

            <div className="flex flex-col md:flex-row justify-between items-center p-4 text-sm text-[var(--muted)]">
              <p className="mb-2 md:mb-0">
                Showing 1-{filtered.length} of {expenses.length}{" "}
                expenses
              </p>

              <div className="flex items-center gap-2">
                <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-2)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[var(--muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded ${
                      p === 1
                        ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-2)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[var(--muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
