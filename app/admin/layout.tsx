"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import Navbar from "@/components/navbar/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="light-mode-wave-bg admin-shell-root fixed inset-0 overflow-hidden bg-[var(--background)] text-[var(--foreground)] lg:flex"
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen((current) => !current)} />

        <main className="light-mode-wave-bg admin-shell-main min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--background)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          {children}
        </main>

        <footer className="relative border-t border-[var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.74),rgba(240,240,240,0.9))] px-4 py-4 backdrop-blur sm:px-5 lg:px-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ring)]/60 to-transparent" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  ExpanceFlow
                </p>{" "}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-[var(--foreground)]">
                Copyright {currentYear} Krushant Joshi
              </p>
              <p className="text-xs text-[var(--muted)]">
                All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
