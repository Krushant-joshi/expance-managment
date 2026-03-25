"use client";

import {
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
    ProfileImage?: string | null;
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
      ProfileImage: parsed.ProfileImage || null,
    };
  });

  useEffect(() => {
    let isMounted = true;

    const syncUser = (data: {
      UserID?: number;
      UserName: string;
      Role: string;
      RoleID?: number;
      Email?: string;
      ProfileImage?: string | null;
    }) => {
      setUser({
        UserID: data.UserID,
        UserName: data.UserName,
        Role: data.Role,
        RoleID: data.RoleID,
        Email: data.Email,
        ProfileImage: data.ProfileImage || null,
      });
    };

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        syncUser(data);
      })
      .catch(() => {});

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!customEvent.detail) return;
      syncUser(customEvent.detail);
    };

    window.addEventListener("user-profile-updated", handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("user-profile-updated", handleProfileUpdated);
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
    <header className="admin-shell-navbar relative z-40 shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/85 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-5 lg:px-6">
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

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--muted-2)] transition-all duration-300 hover:bg-[var(--surface-2)] hover:text-[var(--muted)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="group flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[var(--ring)] sm:gap-3 sm:px-3"
            >
              <div className="relative">
                {user?.ProfileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.ProfileImage}
                    alt={user.UserName || "Profile"}
                    className="h-9 w-9 rounded-lg object-cover shadow-lg shadow-black/20"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] font-semibold text-[var(--accent-contrast)] shadow-lg shadow-black/20">
                    {user?.UserName?.charAt(0) || "A"}
                  </div>
                )}
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

    </header>
  );
}
