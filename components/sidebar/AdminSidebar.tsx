"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Layers,
  BarChart3,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Expenses", icon: Wallet, href: "/admin/expenses" },
  { label: "Add Expense", icon: PlusCircle, href: "/admin/expenses/add" },
  { label: "Categories", icon: Layers, href: "/admin/categories" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ UserName: string; Role: string } | null>(
    null,
  );

  // 🔹 Read user from cookie
  useEffect(() => {
    const match = document.cookie.match(/user=([^;]+)/);
    if (match) {
      try {
        setUser(JSON.parse(decodeURIComponent(match[1])));
      } catch {}
    }
  }, []);

  // 🔹 Logout logic
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  return (
    <aside
      suppressHydrationWarning
      className="w-72 min-h-screen bg-[var(--surface)] border-r border-[var(--border)] px-6 py-8 flex flex-col shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      {/* Logo/Brand */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
            <Wallet className="w-5 h-5 text-[var(--accent-contrast)]" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Admin Console
            </p>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              ExpenseTrack
            </h1>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-[var(--ring)]/10 via-[var(--ring)]/60 to-transparent" />
      </div>

      {/* Profile */}
      <div className="mb-8 p-4 bg-[var(--surface)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center font-bold text-lg shadow-lg">
              {user?.UserName?.charAt(0) || "A"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--surface)]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--foreground)] text-sm">
              {user?.UserName || "Admin"}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {user?.Role || "Administrator"}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/expenses" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_30px_rgba(15,23,42,0.2)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {!active && (
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--ring)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {active && (
                <span className="absolute left-0 h-8 w-1 bg-[var(--accent-contrast)] rounded-r-full shadow-lg shadow-black/10" />
              )}

              <div
                className={`relative z-10 ${
                  active ? "scale-110" : "group-hover:scale-110"
                } transition-transform duration-300`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              <span className="text-sm font-medium relative z-10">
                {item.label}
              </span>

              {active && (
                <ChevronRight className="ml-auto w-4 h-4 opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-2">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-600 transition-all duration-300 group"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
