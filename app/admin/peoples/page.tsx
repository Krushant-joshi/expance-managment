"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

type People = {
  PeopleID: number;
  PeopleCode?: string | null;
  PeopleName: string;
  Email: string;
  MobileNo: string;
  Description?: string | null;
  IsActive?: boolean | null;
};

const emptyForm = {
  PeopleName: "",
  Email: "",
  MobileNo: "",
  Password: "",
  Description: "",
  IsActive: true,
};

export default function PeoplesPage() {
  const [items, setItems] = useState<People[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/peoples");
      const data = await res.json();
      setItems(data);
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
    return items.filter(
      (item) =>
        item.PeopleName.toLowerCase().includes(q) ||
        item.Email.toLowerCase().includes(q) ||
        item.MobileNo.toLowerCase().includes(q)
    );
  }, [items, search]);

  const startCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (item: People) => {
    setEditId(item.PeopleID);
    setForm({
      PeopleName: item.PeopleName,
      Email: item.Email,
      MobileNo: item.MobileNo,
      Password: "",
      Description: item.Description || "",
      IsActive: item.IsActive ?? true,
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

    if (!form.PeopleName.trim() || !form.Email.trim() || !form.MobileNo.trim()) {
      alert("Name, email and mobile are required");
      return;
    }

    if (!editId && !form.Password.trim()) {
      alert("Password is required for new people");
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/peoples/${editId}` : "/api/peoples";
      const method = editId ? "PUT" : "POST";

      const payload = {
        ...form,
        Password: form.Password.trim() || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    if (!confirm("Delete this people entry?")) return;

    const res = await fetch(`/api/peoples/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete people");
      return;
    }

    setItems((prev) => prev.filter((item) => item.PeopleID !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">People</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Manage all people from one page.
            </p>
          </div>

          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            Add People
          </button>
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or mobile"
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
            {editId ? "Edit People" : "Add People"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.PeopleName}
              onChange={(e) => setForm((prev) => ({ ...prev, PeopleName: e.target.value }))}
              placeholder="People name"
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required
            />
            <input
              type="email"
              value={form.Email}
              onChange={(e) => setForm((prev) => ({ ...prev, Email: e.target.value }))}
              placeholder="Email"
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.MobileNo}
              onChange={(e) => setForm((prev) => ({ ...prev, MobileNo: e.target.value }))}
              placeholder="Mobile number"
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required
            />
            <input
              type="password"
              value={form.Password}
              onChange={(e) => setForm((prev) => ({ ...prev, Password: e.target.value }))}
              placeholder={editId ? "New password (optional)" : "Password"}
              className="border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
              required={!editId}
            />
          </div>

          <textarea
            value={form.Description}
            onChange={(e) => setForm((prev) => ({ ...prev, Description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] rounded-xl px-4 py-2 text-sm"
          />

          <label className="inline-flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={form.IsActive}
              onChange={(e) => setForm((prev) => ({ ...prev, IsActive: e.target.checked }))}
            />
            Active
          </label>

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
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Mobile</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  No people found.
                </td>
              </tr>
            )}

            {filteredItems.map((item) => (
              <tr key={item.PeopleID} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-[var(--foreground)]">{item.PeopleName}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{item.Email}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{item.MobileNo}</td>
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
                      onClick={() => deleteItem(item.PeopleID)}
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
              No people found.
            </div>
          )}

          {filteredItems.map((item) => (
            <article key={item.PeopleID} className="rounded-2xl border border-[var(--border)] p-4">
              <p className="font-semibold text-[var(--foreground)]">{item.PeopleName}</p>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <p>{item.Email}</p>
                <p>{item.MobileNo}</p>
                <p>{item.IsActive ? "Active" : "Inactive"}</p>
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
                  onClick={() => deleteItem(item.PeopleID)}
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
