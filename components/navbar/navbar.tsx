"use client";

import {
  Bell,
  Search,
  ChevronDown,
  Moon,
  Sun,
  User,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<{
    UserName: string;
    Role: string;
    Email?: string;
  } | null>(null);

  // 🔹 Read user from cookie
  useEffect(() => {
    const match = document.cookie.match(/user=([^;]+)/);
    if (match) {
      try {
        setUser(JSON.parse(decodeURIComponent(match[1])));
      } catch {}
    }
  }, []);

  // 🔹 Theme init
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = (stored as "light" | "dark") || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // 🔹 Logout logic
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setShowProfileMenu(false);
    router.push("/login");
  };

  return (
    <header className="relative z-50 h-16 bg-[var(--surface)]/85 backdrop-blur border-b border-[var(--border)] flex items-center justify-between px-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      {/* Left: Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Admin Overview
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Real-time expense intelligence
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-2.5 w-96 hover:border-[var(--ring)] transition-all duration-300 group shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
        <Search
          size={16}
          className="text-[var(--muted-2)] group-hover:text-[var(--muted)] transition-colors"
        />
        <input
          type="text"
          placeholder="Search expenses, categories, reports..."
          className="bg-transparent outline-none px-3 text-sm w-full text-[var(--foreground)] placeholder:text-[var(--muted-2)]"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--surface)] text-[var(--muted)] text-xs rounded border border-[var(--border)]">
          <span>⌘</span>K
        </kbd>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[var(--muted-2)] hover:text-[var(--muted)] hover:bg-[var(--surface-2)] rounded-lg transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-[var(--muted-2)] hover:text-[var(--muted)] hover:bg-[var(--surface-2)] rounded-lg transition-all duration-300 group">
          <Bell size={18} className="group-hover:animate-swing" />
          {notifications > 0 && (
            <>
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50">
                {notifications}
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[var(--border)]" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ring)] transition-all duration-300 group shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center text-[var(--accent-contrast)] font-semibold shadow-lg shadow-black/20">
                {user?.UserName?.charAt(0) || "A"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--surface)]" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {user?.UserName || "Admin"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {user?.Role || "Administrator"}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-[var(--muted)] transition-transform duration-300 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {user?.UserName || "Admin"}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {user?.Email || "admin@example.com"}
                </p>
              </div>

              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors">
                  <User size={16} />
                  <span className="text-sm">My Profile</span>
                </button>
              </div>

              <div className="border-t border-[var(--border)] pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
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
