"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, X, Check, Loader2, LayoutGrid } from "lucide-react";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const categoryId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    CategoryName: "",
    IsExpense: true,
    IsIncome: false,
    IsActive: true,
    Description: "",
  });

  /* Fetch Category */
  useEffect(() => {
    if (isNaN(categoryId)) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        const data = await res.json();
        setForm({
          CategoryName: data.CategoryName,
          IsExpense: data.IsExpense,
          IsIncome: data.IsIncome,
          IsActive: data.IsActive,
          Description: data.Description || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const toggleType = (type: "expense" | "income") => {
    if (type === "expense") {
      setForm((prev) => ({ ...prev, IsExpense: true, IsIncome: false }));
    } else {
      setForm((prev) => ({ ...prev, IsExpense: false, IsIncome: true }));
    }
  };

  const toggleActive = () => {
    setForm((prev) => ({ ...prev, IsActive: !prev.IsActive }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.CategoryName.trim()) return;

    setSaving(true);
    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[var(--muted)]" size={48} />
          <p className="text-[var(--muted)] font-medium">
            Loading category details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 sm:p-8 font-sans">
      <style>{`
        .switch {
          font-size: 17px;
          position: relative;
          display: inline-block;
          width: 3.5em;
          height: 2em;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: var(--surface-2);
          border-radius: 50px;
          transition: all 0.35s ease;
        }
        .slider:before {
          position: absolute;
          content: "";
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2em;
          width: 2em;
          inset: 0;
          background-color: var(--surface);
          border-radius: 50px;
          box-shadow: 0 8px 16px rgba(15,23,42,0.25);
          transition: all 0.35s ease;
        }
        .switch input:checked + .slider {
          background: var(--accent);
        }
        .switch input:checked + .slider:before {
          transform: translateX(1.6em);
        }
      `}</style>

      <div className="w-full max-w-2xl bg-[var(--surface)]/85 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.1)] border border-[var(--border)] overflow-hidden text-[var(--foreground)]">
        <div className="p-8">
          <div className="mb-8 border-b border-[var(--border)] pb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Edit Category
            </p>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              Update Category
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Update the details for{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {form.CategoryName}
              </span>
              .
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <InputField
                label="Category Name"
                placeholder="e.g. Groceries"
                icon={<LayoutGrid size={18} />}
                required
                value={form.CategoryName}
                onChange={(e) =>
                  setForm({ ...form, CategoryName: e.target.value })
                }
              />

              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  Category Status
                </label>
                <div className="flex items-center gap-4 h-[50px]">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={form.IsActive}
                      onChange={toggleActive}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="text-sm font-medium text-[var(--muted)]">
                    {form.IsActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => toggleType("expense")}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 group ${
                    form.IsExpense
                      ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-md scale-[1.01]"
                      : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--ring)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span
                    className={`text-xs uppercase tracking-[0.2em] transition-transform group-hover:scale-105 ${
                      form.IsExpense
                        ? "scale-105 text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    Expense
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        form.IsExpense
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      Outgoing
                    </span>
                    {form.IsExpense && (
                      <Check
                        size={14}
                        className="text-[var(--foreground)]"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleType("income")}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 group ${
                    form.IsIncome
                      ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-md scale-[1.01]"
                      : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--ring)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span
                    className={`text-xs uppercase tracking-[0.2em] transition-transform group-hover:scale-105 ${
                      form.IsIncome
                        ? "scale-105 text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    Income
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        form.IsIncome
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      Incoming
                    </span>
                    {form.IsIncome && (
                      <Check
                        size={14}
                        className="text-[var(--foreground)]"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Description{" "}
                <span className="text-[var(--muted-2)] font-normal">
                  (optional)
                </span>
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-[var(--muted-2)] group-hover:text-[var(--muted)] transition-colors">
                  <FileText size={18} />
                </span>
                <textarea
                  rows={3}
                  placeholder="What is this category for?"
                  value={form.Description}
                  onChange={(e) =>
                    setForm({ ...form, Description: e.target.value })
                  }
                  className="w-full border-2 border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all resize-none hover:border-[var(--ring)] bg-[var(--surface)] text-[var(--foreground)]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t-2 border-[var(--border)]">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-all duration-300 font-medium"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Updating..." : "Update Category"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  required = false,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-2)] group-hover:text-[var(--muted)] transition-colors">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full border-2 border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all hover:border-[var(--ring)] bg-[var(--surface)] text-[var(--foreground)]"
        />
      </div>
    </div>
  );
}
