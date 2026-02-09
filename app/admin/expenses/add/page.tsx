"use client";

import {
  Wallet,
  Calendar,
  Tag,
  FileText,
  DollarSign,
  Save,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Category = {
  CategoryID: number;
  CategoryName: string;
};

type People = {
  PeopleID: number;
  PeopleName: string;
};

/* ================= MAIN ================= */

export default function AddExpensePage() {
  const router = useRouter();

  /* ============ STATES ============ */

  const [categories, setCategories] = useState<Category[]>([]);
  const [peoples, setPeoples] = useState<People[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    peopleId: "",
    date: "",
    notes: "",
    paymentMethod: "",
  });

  /* ============ FETCH MASTER DATA ============ */

  useEffect(() => {
    fetchCategories();
    fetchPeoples();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Category load error", err);
    }
  };

  const fetchPeoples = async () => {
    try {
      const res = await fetch("/api/peoples");
      const data = await res.json();
      setPeoples(data);
    } catch (err) {
      console.error("People load error", err);
    }
  };

  /* ============ FORM HANDLER ============ */

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============ SUBMIT ============ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.amount ||
      !form.categoryId ||
      !form.peopleId ||
      !form.date
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ExpenseDate: form.date,
          CategoryID: Number(form.categoryId),
          PeopleID: Number(form.peopleId),
          Amount: Number(form.amount),
          ExpenseDetail: form.title,
          Description: form.notes,
          PaymentMethod: form.paymentMethod,

          UserID: 1, // TODO: replace with login user
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Expense added successfully");

      router.push("/admin/expenses");
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  /* ============ UI ============ */

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl bg-[var(--surface)]/70 backdrop-blur border border-[var(--border)] p-8 text-[var(--foreground)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#f2e7d6] rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#efe1cc] rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-[var(--accent)] rounded-2xl shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
                <Wallet className="w-6 h-6 text-[var(--accent-contrast)]" />
              </div>

              <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                Add New Expense
              </h1>
            </div>

            <p className="text-[var(--muted)] text-lg">
              Keep track of where your money goes
            </p>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <div className="bg-[var(--surface)]/85 backdrop-blur-lg rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-[var(--border)] text-[var(--foreground)]">
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Expense Title"
                  placeholder="e.g., Grocery Shopping"
                  icon={<FileText size={18} />}
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />

                <InputField
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  icon={<DollarSign size={18} />}
                  required
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Category"
                  icon={<Tag size={18} />}
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  options={categories.map((c) => ({
                    value: String(c.CategoryID),
                    label: c.CategoryName,
                  }))}
                />

                <InputField
                  label="Date"
                  type="date"
                  icon={<Calendar size={18} />}
                  required
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              {/* People */}
              <SelectField
                label="Paid To"
                icon={<Tag size={18} />}
                name="peopleId"
                value={form.peopleId}
                onChange={handleChange}
                options={peoples.map((p) => ({
                  value: String(p.PeopleID),
                  label: p.PeopleName,
                }))}
              />

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                  Payment Method <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "Cash", icon: "Cash" },
                    { name: "Card", icon: "Card" },
                    { name: "UPI", icon: "UPI" },
                    { name: "Bank", icon: "Bank" },
                  ].map((method) => (
                    <button
                      key={method.name}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, paymentMethod: method.name })
                      }
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300
          ${
            form.paymentMethod === method.name
              ? "border-[var(--accent)] bg-[var(--surface-2)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
          }`}
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {method.icon}
                      </span>

                      <span
                        className={`text-xs font-medium ${
                          form.paymentMethod === method.name
                            ? "text-slate-900"
                            : "text-slate-600"
                        }`}
                      >
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  Notes
                </label>

                <textarea
                  rows={4}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add notes..."
                  className="w-full border-2 border-[var(--border)] rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent bg-[var(--surface)]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-[var(--border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--surface-2)] transition"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-xl shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:opacity-90 transition"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  required = false,
  value,
  onChange,
  prefix,
  name,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  name: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-2)]">
          {icon}
        </span>

        {prefix && (
          <span className="absolute left-12 top-1/2 -translate-y-1/2 text-[var(--foreground)] font-semibold">
            {prefix}
          </span>
        )}

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full border-2 border-[var(--border)] rounded-xl ${
            prefix ? "pl-16" : "pl-12"
          } pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent bg-[var(--surface)] text-[var(--foreground)]`}
        />
      </div>
    </div>
  );
}

/* ================= SELECT ================= */

function SelectField({
  label,
  options,
  icon,
  value,
  onChange,
  name,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  icon: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        {label} <span className="text-rose-500">*</span>
      </label>

      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-2)] z-10">
          {icon}
        </span>

        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full border-2 border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent bg-[var(--surface)] text-[var(--foreground)]"
        >
          <option value="">Select</option>

          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
