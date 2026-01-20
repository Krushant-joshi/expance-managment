import ExpenseBadge from "@/components/expenses/ExpenseBadge";
import ExpenseActions from "@/components/expenses/ExpenseActions";
import StatCard from "@/components/dashboard/StatCard";

export default function ExpensesPage() {
  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-black">Manage and track all your expenses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Expense" value="₹12,500" color="indigo" />
        <StatCard title="This Month" value="₹4,200" color="emerald" />
        <StatCard title="Avg / Day" value="₹350" color="amber" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
        <input
          placeholder="Search expense..."
          className="border rounded-lg px-3 py-2 text-sm w-64 text-black"
        />

        <select className="border rounded-lg px-3 py-2 text-sm text-black">
          <option>All Categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <input
          type="date"
          className="border rounded-lg px-3 py-2 text-sm text-black"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-black">
            <tr>
              <th className="text-left px-6 py-4">Title</th>
              <th>Date</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y text-black">
            {expenses.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{e.title}</td>
                <td>{e.date}</td>
                <td>
                  <ExpenseBadge label={e.category} />
                </td>
                <td className="text-right font-semibold">₹{e.amount}</td>
                <td className="text-center">
                  <ExpenseActions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* DUMMY DATA */
const expenses = [
  {
    title: "Groceries",
    date: "10 Aug 2026",
    category: "Food",
    amount: 1200,
  },
  {
    title: "Uber Ride",
    date: "11 Aug 2026",
    category: "Transport",
    amount: 350,
  },
  {
    title: "Electric Bill",
    date: "12 Aug 2026",
    category: "Bills",
    amount: 2100,
  },
  {
    title: "Shopping Mall",
    date: "13 Aug 2026",
    category: "Shopping",
    amount: 1800,
  },
];
