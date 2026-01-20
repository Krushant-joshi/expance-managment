import Link from "next/link";

export default function UserSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow text-gray-800">
      <div className="p-6 text-xl font-bold text-black">User Panel</div>

      <nav className="px-4 space-y-2">
        <Link
          href="/user/dashboard"
          className="block p-2 rounded text-gray-700 hover:bg-gray-200 hover:text-black"
        >
          Dashboard
        </Link>

        <Link
          href="/user/expenses"
          className="block p-2 rounded text-gray-700 hover:bg-gray-200 hover:text-black"
        >
          Expenses
        </Link>

        <Link
          href="/user/add-expense"
          className="block p-2 rounded text-gray-700 hover:bg-gray-200 hover:text-black"
        >
          Add Expense
        </Link>
      </nav>
    </aside>
  );
}
