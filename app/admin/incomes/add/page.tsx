"use client";

import {
  Calendar,
  DollarSign,
  FileText,
  Save,
  Tag,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectField from "@/components/form/SelectField";
import { getUserFromCookie } from "@/lib/userCookie";

type Category = {
  CategoryID: number;
  CategoryName: string;
  IsIncome?: boolean;
};

type People = {
  PeopleID: number;
  PeopleName: string;
};

type SubCategory = {
  SubCategoryID: number;
  SubCategoryName: string;
};

type Project = {
  ProjectID: number;
  ProjectName: string;
};

export default function AddIncomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [peoples, setPeoples] = useState<People[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    subCategoryId: "",
    peopleId: "",
    projectId: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    const user = getUserFromCookie(document.cookie);
    const parsed = Number(user?.UserID);
    if (Number.isFinite(parsed) && parsed > 0) {
      setUserId(parsed);
    }

    fetchCategories();
    fetchPeoples();
    fetchSubCategories();
    fetchProjects();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data: Category[] = await res.json();
      const incomeCategories = data.filter((cat) => cat.IsIncome === true);
      setCategories(incomeCategories.length > 0 ? incomeCategories : data);
    } catch (error) {
      console.error("Category load error", error);
    }
  };

  const fetchPeoples = async () => {
    try {
      const res = await fetch("/api/peoples");
      const data = await res.json();
      setPeoples(data);
    } catch (error) {
      console.error("People load error", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await fetch("/api/sub-categories");
      const data = await res.json();
      setSubCategories(data);
    } catch (error) {
      console.error("Sub category load error", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Project load error", error);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.amount ||
      !form.categoryId ||
      !form.peopleId ||
      !form.date ||
      !userId
    ) {
      alert("Please fill all required fields and login again");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/incomes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IncomeDate: form.date,
          CategoryID: Number(form.categoryId),
          SubCategoryID: form.subCategoryId
            ? Number(form.subCategoryId)
            : null,
          PeopleID: Number(form.peopleId),
          ProjectID: form.projectId ? Number(form.projectId) : null,
          Amount: Number(form.amount),
          IncomeDetail: form.title,
          Description: form.notes,
          UserID: userId,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Income added successfully");
      router.push("/admin/incomes");
    } catch (error) {
      console.error(error);
      alert("Failed to save income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--surface)]/70 backdrop-blur border border-[var(--border)] p-8 text-[var(--foreground)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--surface-2)]/90 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[var(--surface-2)]/70 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-[var(--accent)] rounded-2xl shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
                <Wallet className="w-6 h-6 text-[var(--accent-contrast)]" />
              </div>
              <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                Add New Income
              </h1>
            </div>
            <p className="text-[var(--muted)] text-lg">
              Track every source of incoming money
            </p>
          </div>
        </div>

        <div className="bg-[var(--surface)]/85 backdrop-blur-lg rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-[var(--border)] text-[var(--foreground)]">
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Income Title"
                  placeholder="e.g., Salary"
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

              <SelectField
                label="Received From"
                icon={<Tag size={18} />}
                name="peopleId"
                value={form.peopleId}
                onChange={handleChange}
                options={peoples.map((p) => ({
                  value: String(p.PeopleID),
                  label: p.PeopleName,
                }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Sub Category"
                  icon={<Tag size={18} />}
                  name="subCategoryId"
                  value={form.subCategoryId}
                  onChange={handleChange}
                  options={subCategories.map((s) => ({
                    value: String(s.SubCategoryID),
                    label: s.SubCategoryName,
                  }))}
                  required={false}
                />
                <SelectField
                  label="Project"
                  icon={<Tag size={18} />}
                  name="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                  options={projects.map((p) => ({
                    value: String(p.ProjectID),
                    label: p.ProjectName,
                  }))}
                  required={false}
                />
              </div>

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
                  {loading ? "Saving..." : "Save Income"}
                </button>
              </div>
            </form>
          </div>
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
