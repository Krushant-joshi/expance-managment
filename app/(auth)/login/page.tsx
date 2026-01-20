"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-black">Login</h2>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="w-full bg-black text-white py-2 rounded mb-3"
        >
          Login as Admin
        </button>

        <button
          onClick={() => router.push("/user/dashboard")}
          className="w-full bg-gray-700 text-white py-2 rounded"
        >
          Login as User
        </button>
      </div>
    </div>
  );
}
