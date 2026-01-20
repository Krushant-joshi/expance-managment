"use client";

import { Wallet, Calendar, Tag, FileText } from "lucide-react";

export default function AddExpensePage() {
  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 p-8 text-white shadow">
        <h1 className="text-2xl font-bold">Add New Expense</h1>
        <p className="text-indigo-100 mt-1">
          Keep track of where your money goes
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow p-8">
        <form className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Title */}
            <InputField
              label="Expense Title"
              placeholder="Grocery Shopping"
              icon={<FileText size={18} />}
            />

            {/* Amount */}
            <InputField
              label="Amount (₹)"
              type="number"
              placeholder="1200"
              icon={<Wallet size={18} />}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <SelectField
              label="Category"
              icon={<Tag size={18} />}
              options={[
                "Food",
                "Transport",
                "Shopping",
                "Bills",
                "Entertainment",
              ]}
            />

            {/* Date */}
            <InputField
              label="Date"
              type="date"
              icon={<Calendar size={18} />}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              rows={4}
              placeholder="Any additional details..."
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center pt-6 border-t">
            <p className="text-sm text-gray-500">
              Make sure all details are correct
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
              >
                Save Expense
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* REUSABLE INPUT */
function InputField({
  label,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}

/* REUSABLE SELECT */
function SelectField({
  label,
  options,
  icon,
}: {
  label: string;
  options: string[];
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <select className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Select category</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
