import Navbar from "@/components/navbar/navbar";
import UserSidebar from "@/components/sidebar/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
