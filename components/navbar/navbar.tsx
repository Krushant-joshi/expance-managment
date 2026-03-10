"use client";

import {
  Bell,
  Search,
  ChevronDown,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromCookie } from "@/lib/userCookie";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifications = 3;
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initial);
    return initial;
  });
  const [user, setUser] = useState<{
    UserID?: number;
    UserName: string;
    Role: string;
    RoleID?: number;
    Email?: string;
  } | null>(() => {
    if (typeof document === "undefined") return null;
    const parsed = getUserFromCookie(document.cookie);
    if (!parsed?.UserName || !parsed?.Role) return null;

    const userId = Number(parsed.UserID);
    const roleId = Number(parsed.RoleID);

    return {
      UserID: Number.isFinite(userId) ? userId : undefined,
      UserName: parsed.UserName,
      Role: parsed.Role,
      RoleID: Number.isFinite(roleId) ? roleId : undefined,
      Email: parsed.Email,
    };
  });

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setUser({
          UserID: data.UserID,
          UserName: data.UserName,
          Role: data.Role,
          RoleID: data.RoleID,
          Email: data.Email,
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setShowProfileMenu(false);
    router.push("/login");
  };

  const isAdmin = user?.RoleID === 1 || user?.Role === "Administrator";
  const roleLabel = isAdmin ? "Administrator" : "User";
  const panelTitle = isAdmin ? "Admin Overview" : "User Overview";

  return (
    <header className="admin-shell-navbar relative z-40 border-b border-[var(--border)] bg-[var(--surface)]/85 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-5 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
              {panelTitle}
            </h1>
            <p className="text-xs text-[var(--muted)]">ExpanceFlow workspace</p>
          </div>
        </div>

        <div className="order-3 flex w-full items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-all duration-300 group hover:border-[var(--ring)] md:order-none md:max-w-md lg:w-96">
          <Search
            size={16}
            className="text-[var(--muted-2)] transition-colors group-hover:text-[var(--muted)]"
          />
          <input
            type="text"
            placeholder="Search expenses, categories, reports..."
            className="w-full bg-transparent px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-2)]"
          />
          <kbd className="hidden items-center gap-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)] lg:inline-flex">
            <span>Ctrl</span>K
          </kbd>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--muted-2)] transition-all duration-300 hover:bg-[var(--surface-2)] hover:text-[var(--muted)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="group relative rounded-lg p-2 text-[var(--muted-2)] transition-all duration-300 hover:bg-[var(--surface-2)] hover:text-[var(--muted)]">
            <Bell size={18} className="group-hover:animate-swing" />
            {notifications > 0 && (
              <>
                <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-xs font-bold text-white shadow-lg shadow-rose-500/50">
                  {notifications}
                </span>
              </>
            )}
          </button>

          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="group flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[var(--ring)] sm:gap-3 sm:px-3"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] font-semibold text-[var(--accent-contrast)] shadow-lg shadow-black/20">
                  {user?.UserName?.charAt(0) || "A"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-emerald-500" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {user?.UserName || "Admin"}
                </p>
                <p className="text-xs text-[var(--muted)]">{user?.Role || roleLabel}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-[var(--muted)] transition-transform duration-300 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-2xl shadow-black/10 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-[var(--border)] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {user?.UserName || "Admin"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {user?.Email || "admin@example.com"}
                  </p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/admin/profile");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                  >
                    <User size={16} />
                    <span className="text-sm">My Profile</span>
                  </button>
                </div>

                <div className="border-t border-[var(--border)] pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-rose-600 transition-colors hover:bg-rose-500/10"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes swing {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }
        .group:hover .animate-swing {
          animation: swing 0.5s ease-in-out;
        }
      `}</style>
    </header>
  );
}
