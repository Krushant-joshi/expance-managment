"use client";

import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* COLOR + ICON FALLBACKS */
const COLORS = [
  "#1f2937",
  "#9f7e54",
  "#3b7c6e",
  "#b45352",
  "#7c6f60",
  "#4b5563",
  "#6b7280",
  "#a08b6c",
];

const ICONS = ["Food", "Cafe", "Travel", "Bills", "Games", "Health", "Books", "Box"];

export default function CategoriesPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "with" | "empty">("all");

  /* 🔹 FETCH CATEGORIES FROM API */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((cat: any, index: number) => {
          const expenses = cat.expenses || [];

          return {
            id: cat.CategoryID,
            name: cat.CategoryName,
            color: COLORS[index % COLORS.length],
            icon: ICONS[index % ICONS.length],
            count: expenses.length,
            total: expenses.reduce(
              (sum: number, e: any) => sum + Number(e.Amount || 0),
              0,
            ),
            trend: "0%",
          };
        });

        setCategories(mapped);
        setLoading(false);
      });
  }, []);

  /* 🔹 DELETE CATEGORY */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterMode === "all"
        ? true
        : filterMode === "with"
          ? cat.count > 0
          : cat.count === 0;
    return matchesSearch && matchesFilter;
  });

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.count, 0);
  const totalAmount = categories.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[var(--background)] p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[var(--surface)]/80 backdrop-blur rounded-3xl p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-[var(--border)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Categories
              </p>
              <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                Category Library
              </h1>
              <p className="text-[var(--muted)] mt-2">
                Organize and manage your expense categories.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/categories/add")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 transition-all duration-300 shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Category
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--surface-2)] rounded-2xl p-4 border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Total Categories
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
                {categories.length}
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Total Expenses
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
                {totalExpenses}
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Total Amount
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
                {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-2)]" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all text-[var(--foreground)] placeholder:text-[var(--muted-2)]"
            />
          </div>
          <button
            onClick={() =>
              setFilterMode((prev) =>
                prev === "all" ? "with" : prev === "with" ? "empty" : "all",
              )
            }
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-2)] transition-colors font-medium text-[var(--foreground)]"
          >
            <Filter size={18} />
            {filterMode === "all"
              ? "All"
              : filterMode === "with"
                ? "With Expenses"
                : "Empty"}
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat, i) => {
            const isPositiveTrend = cat.trend.startsWith("+");
            const isHovered = hoveredCard === i;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]
                  hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)] hover:-translate-y-1 
                  transition-all duration-300 cursor-pointer
                  ${isHovered ? "ring-2 ring-[var(--ring)]" : ""}
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[11px] uppercase tracking-[0.2em] text-white shadow-lg transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: cat.color }}
                      >
                        {cat.count}
                      </span>
                    </div>
                  </div>

                  <button className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] rounded-lg transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-[var(--foreground)] text-lg mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">{cat.count} expenses</p>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Total Spent</p>
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      {cat.total.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      isPositiveTrend
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <TrendingUp
                      size={12}
                      className={isPositiveTrend ? "" : "rotate-180"}
                    />
                    {cat.trend}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/categories/edit/${cat.id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[#8c6d3d] bg-[#fbf4ea] hover:bg-[#f6e8d5] rounded-lg transition-colors text-sm font-medium"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && filteredCategories.length === 0 && (
          <div className="bg-[var(--surface)] rounded-2xl p-12 text-center border border-[var(--border)]">
            <div className="w-20 h-20 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[var(--muted-2)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              No categories found
            </h3>
            <p className="text-[var(--muted)]">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
