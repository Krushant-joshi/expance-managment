import AdminSidebar from "@/components/sidebar/AdminSidebar";
import Navbar from "@/components/navbar/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
