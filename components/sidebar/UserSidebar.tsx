"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  PlusSquare,
  User,
  TrendingUp,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/user/dashboard" },
  { label: "My Expenses", icon: Receipt, href: "/user/expenses" },
  { label: "Add Expense", icon: PlusSquare, href: "/user/add-expense" },
];

const quickLinks = [
  { label: "Analytics", icon: TrendingUp, href: "/user/analytics" },
  { label: "Notifications", icon: Bell, href: "/user/notifications", badge: 3 },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[var(--surface)] text-[var(--foreground)] border-r border-[var(--border)] px-6 py-8 flex flex-col shadow-[0_20px_60px_rgba(2,6,23,0.25)]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 bg-[var(--accent)] rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
            <Receipt className="w-5 h-5 text-[var(--accent-contrast)]" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              User Workspace
            </p>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Expense Manager
            </h1>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-[var(--ring)]/40 via-[var(--ring)]/30 to-transparent" />
      </div>

      {/* Profile Card */}
      <div className="mb-8 p-4 bg-[var(--surface)]/70 backdrop-blur rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--accent-contrast)] font-semibold text-lg shadow-md">
              U
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[var(--surface)]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--foreground)] text-sm">
              User Account
            </p>
            <p className="text-xs text-[var(--muted)]">Active Member</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[var(--muted)]">Plan</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-500 font-medium">
            Standard
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 flex-1">
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative
                ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_10px_24px_rgba(16,185,129,0.15)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 h-8 w-1 bg-[var(--accent-contrast)] rounded-r-full shadow-md" />
              )}

              {/* Icon */}
              <div
                className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-300`}
              >
                <Icon size={20} strokeWidth={2.3} />
              </div>

              {/* Label */}
              <span className="text-sm font-medium">{item.label}</span>

              {/* Hover effect */}
              {!active && (
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--ring)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              )}
            </Link>
          );
        })}

        {/* Quick Links Section */}
        <div className="pt-6">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-3">
            Quick Links
          </p>
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-300 relative"
              >
                <Icon
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-2">
        <Link
          href="/user/help"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-300 group"
        >
          <HelpCircle
            size={20}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-sm font-medium">Help & Support</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 group"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
