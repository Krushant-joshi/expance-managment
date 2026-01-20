import StatCard from "@/components/dashboard/StatCard";
import ExpenseLineChart from "@/components/dashboard/ExpenseLineChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expense Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track, analyze and control your spending
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Expense" value="₹12,500" color="indigo" />
        <StatCard title="This Month" value="₹4,200" color="emerald" />
        <StatCard title="Avg / Day" value="₹350" color="amber" />
        <StatCard title="Categories" value="6" color="rose" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ExpenseLineChart />
        </div>
        <CategoryPieChart />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses />
    </div>
  );
}
