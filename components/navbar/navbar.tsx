"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b flex items-center justify-between px-6">
      {/* Left: Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Expense Management
        </h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-3 py-2 w-80">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses, categories..."
          className="bg-transparent outline-none px-2 text-sm w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            K
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            Krushant
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
