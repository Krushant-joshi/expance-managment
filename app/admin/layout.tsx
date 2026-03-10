"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import Navbar from "@/components/navbar/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      className="light-mode-wave-bg admin-shell-root min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:flex"
    >
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen((current) => !current)} />

        <main className="light-mode-wave-bg admin-shell-main flex-1 overflow-y-auto bg-[var(--background)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
