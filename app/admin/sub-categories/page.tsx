"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

type Category = {
  CategoryID: number;
  CategoryName: string;
};

type SubCategory = {
  SubCategoryID: number;
  SubCategoryName: string;
  CategoryID: number;
  IsExpense: boolean;
  IsIncome: boolean;
  IsActive: boolean;
  Description?: string | null;
  categories?: { CategoryName: string };
};

const emptyForm = {
  SubCategoryName: "",
  CategoryID: "",
  IsExpense: true,
  IsIncome: false,
  Description: "",
  IsActive: true,
};

export default function SubCategoriesPage() {
  const [items, setItems] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        fetch("/api/sub-categories"),
        fetch("/api/categories"),
      ]);

      const [subData, catData] = await Promise.all([subRes.json(), catRes.json()]);

      setItems(subData);
      setCategories(catData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const categoryName = item.categories?.CategoryName || "";
      return (
        item.SubCategoryName.toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const startCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (item: SubCategory) => {
    setEditId(item.SubCategoryID);
    setForm({
      SubCategoryName: item.SubCategoryName,
      CategoryID: String(item.CategoryID),
      IsExpense: Boolean(item.IsExpense),
      IsIncome: Boolean(item.IsIncome),
      Description: item.Description || "",
      IsActive: Boolean(item.IsActive),
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.SubCategoryName.trim() || !form.CategoryID) {
      alert("Sub category name and category are required");
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/sub-categories/${editId}` : "/api/sub-categories";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          CategoryID: Number(form.CategoryID),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      await loadData();
      closeForm();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this sub category?")) return;

    const res = await fetch(`/api/sub-categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete sub category");
      return;
    }

    setItems((prev) => prev.filter((item) => item.SubCategoryID !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">Sub Categories</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Manage all sub categories from one page.
            </p>
          </div>

          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            Add Sub Category
          </button>
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sub category or category"
            className="w-full md:w-96 border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
          />
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={saveItem}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {editId ? "Edit Sub Category" : "Add Sub Category"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.SubCategoryName}
              onChange={(e) => setForm((prev) => ({ ...prev, SubCategoryName: e.target.value }))}
              placeholder="Sub category name"
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required
            />

            <select
              value={form.CategoryID}
              onChange={(e) => setForm((prev) => ({ ...prev, CategoryID: e.target.value }))}
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.IsExpense}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, IsExpense: e.target.checked, IsIncome: !e.target.checked }))
                }
              />
              Expense
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.IsIncome}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, IsIncome: e.target.checked, IsExpense: !e.target.checked }))
                }
              />
              Income
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.IsActive}
                onChange={(e) => setForm((prev) => ({ ...prev, IsActive: e.target.checked }))}
              />
              Active
            </label>
          </div>

          <textarea
            value={form.Description}
            onChange={(e) => setForm((prev) => ({ ...prev, Description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)]"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)]"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  No sub categories found.
                </td>
              </tr>
            )}

            {filteredItems.map((item) => (
              <tr key={item.SubCategoryID} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-[var(--foreground)]">{item.SubCategoryName}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{item.categories?.CategoryName || "-"}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {item.IsExpense ? "Expense" : item.IsIncome ? "Income" : "-"}
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{item.IsActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fbf4ea] text-[#8c6d3d]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.SubCategoryID)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {!loading && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-[var(--border)] p-6 text-center text-[var(--muted)]">
              No sub categories found.
            </div>
          )}

          {filteredItems.map((item) => (
            <article key={item.SubCategoryID} className="rounded-2xl border border-[var(--border)] p-4">
              <p className="font-semibold text-[var(--foreground)]">{item.SubCategoryName}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--muted)]">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Category</p>
                  <p className="mt-1">{item.categories?.CategoryName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Type</p>
                  <p className="mt-1">
                    {item.IsExpense ? "Expense" : item.IsIncome ? "Income" : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Status</p>
                  <p className="mt-1">{item.IsActive ? "Active" : "Inactive"}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#fbf4ea] px-3 py-2 text-[#8c6d3d]"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.SubCategoryID)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-rose-600"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
