"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Layers,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Expenses", icon: Wallet, href: "/admin/expenses" },
  { label: "Add Expense", icon: PlusCircle, href: "/admin/add-expense" },
  { label: "Categories", icon: Layers, href: "/admin/categories" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r px-5 py-8 flex flex-col">
      {/* Profile */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
          K
        </div>
        <div>
          <p className="font-semibold text-gray-900">Krushant Joshi</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition relative
                ${
                  active
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 h-6 w-1 bg-indigo-600 rounded-r" />
              )}
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
