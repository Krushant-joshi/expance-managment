"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark"
        | null) || "light";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text)] transition hover:bg-[var(--landing-surface-2)]"
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

