"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  HandCoins,
  Layers,
  FolderKanban,
  Users,
  BarChart3,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserFromCookie } from "@/lib/userCookie";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Expenses", icon: Wallet, href: "/admin/expenses" },
  { label: "Incomes", icon: HandCoins, href: "/admin/incomes" },
  { label: "Categories", icon: Layers, href: "/admin/categories" },
  { label: "Sub Categories", icon: Layers, href: "/admin/sub-categories" },
  { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { label: "People", icon: Users, href: "/admin/peoples" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [user, setUser] = useState<{ UserName: string; Role: string; RoleID: number } | null>(
    () => {
      if (typeof document === "undefined") return null;
      const parsed = getUserFromCookie(document.cookie);
      const roleId = Number(parsed?.RoleID);
      if (!parsed?.UserName || !parsed?.Role || !Number.isFinite(roleId)) {
        return null;
      }
      return {
        UserName: parsed.UserName,
        Role: parsed.Role,
        RoleID: roleId,
      };
    },
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setUser({
          UserName: data.UserName,
          Role: data.Role,
          RoleID: data.RoleID,
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    onClose();
    router.push("/login");
  };

  const isAdmin = user?.RoleID === 1 || user?.Role === "Administrator";
  const sidebarWidth = collapsed ? "w-24" : "w-72";

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        suppressHydrationWarning
        className={`admin-shell-sidebar fixed inset-y-0 left-0 z-50 ${sidebarWidth} flex min-h-screen flex-col border-r border-[var(--border)] bg-[var(--surface)]/78 px-4 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 z-20 hidden h-7 w-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={14} className="mx-auto" />
          ) : (
            <ChevronLeft size={14} className="mx-auto" />
          )}
        </button>

        <div className="mb-8">
          <div
            className={`mb-2 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
              <Wallet className="h-5 w-5 text-[var(--accent-contrast)]" />
            </div>
            <div className={collapsed ? "hidden" : "block"}>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                {isAdmin ? "Admin Console" : "User Console"}
              </p>
              <h1 className="text-lg font-semibold text-[var(--foreground)]">ExpanceFlow</h1>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-[var(--ring)]/10 via-[var(--ring)]/60 to-transparent" />
        </div>

        <div
          className={`mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)] ${
            collapsed ? "p-3" : "p-4"
          }`}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-lg font-bold text-[var(--accent-contrast)] shadow-lg">
                {user?.UserName?.charAt(0) || "A"}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[var(--surface)] bg-emerald-500" />
            </div>
            <div className={`flex-1 ${collapsed ? "hidden" : "block"}`}>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {user?.UserName || "Admin"}
              </p>
              <p className="text-xs text-[var(--muted)]">{user?.Role || "Administrator"}</p>
            </div>
            {!collapsed && <ChevronRight className="h-4 w-4 text-[var(--muted)]" />}
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] ${
              collapsed ? "px-0 text-center" : "px-3"
            }`}
          >
            Navigation
          </p>
          {menu.map((item) => {
            const sectionRoots = [
              "/admin/expenses",
              "/admin/incomes",
              "/admin/categories",
              "/admin/sub-categories",
              "/admin/projects",
              "/admin/peoples",
              "/admin/reports",
            ];
            const active =
              pathname === item.href ||
              (sectionRoots.includes(item.href) && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center overflow-hidden rounded-xl py-3 transition-all duration-300 ${
                  collapsed ? "justify-center px-2" : "gap-3 px-4"
                } ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_30px_rgba(15,23,42,0.2)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
              >
                {!active && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--ring)]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
                {active && (
                  <span className="absolute left-0 h-8 w-1 rounded-r-full bg-[var(--accent-contrast)] shadow-lg shadow-black/10" />
                )}

                <div
                  className={`relative z-10 transition-transform duration-300 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>

                <span
                  className={`relative z-10 text-sm font-medium ${
                    collapsed ? "hidden" : "block"
                  }`}
                >
                  {item.label}
                </span>

                {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-6">
          <button
            onClick={handleLogout}
            className={`group flex w-full items-center rounded-xl py-3 text-[var(--muted)] transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-600 ${
              collapsed ? "justify-center px-2" : "gap-3 px-4"
            }`}
          >
            <LogOut
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className={`text-sm font-medium ${collapsed ? "hidden" : "block"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
