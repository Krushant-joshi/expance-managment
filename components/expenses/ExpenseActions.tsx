import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ExpenseActions() {
  return (
    <div className="flex gap-2">
      <button className="p-1 text-gray-500 hover:text-indigo-600">
        <Eye size={16} />
      </button>
      <button className="p-1 text-gray-500 hover:text-amber-600">
        <Pencil size={16} />
      </button>
      <button className="p-1 text-gray-500 hover:text-rose-600">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
