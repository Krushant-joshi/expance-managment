import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage expense categories</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
          >
            {/* Color Indicator */}
            <div
              className="w-10 h-10 rounded-full mb-4"
              style={{ backgroundColor: cat.color }}
            />

            <h3 className="font-semibold text-gray-900">{cat.name}</h3>

            <p className="text-sm text-gray-500 mt-1">{cat.count} expenses</p>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-amber-600 hover:text-amber-700">
                <Pencil size={16} />
              </button>
              <button className="text-rose-600 hover:text-rose-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* DUMMY CATEGORY DATA */
const categories = [
  { name: "Food", color: "#10B981", count: 12 },
  { name: "Transport", color: "#6366F1", count: 8 },
  { name: "Shopping", color: "#F59E0B", count: 6 },
  { name: "Bills", color: "#EF4444", count: 5 },
  { name: "Entertainment", color: "#8B5CF6", count: 4 },
  { name: "Health", color: "#14B8A6", count: 3 },
  { name: "Education", color: "#0EA5E9", count: 2 },
  { name: "Others", color: "#6B7280", count: 1 },
];
