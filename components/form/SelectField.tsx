"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  options: Option[];
  icon: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  required?: boolean;
  placeholder?: string;
};

export default function SelectField({
  label,
  options,
  icon,
  value = "",
  onChange,
  name,
  required = true,
  placeholder = "Select",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const triggerChange = (nextValue: string) => {
    onChange?.({
      target: { name, value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div ref={rootRef}>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full border-2 border-[var(--border)] rounded-xl pl-12 pr-11 py-3 text-sm bg-[var(--surface)] text-left text-[var(--foreground)] transition-all duration-200 hover:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-2)] z-10">
            {icon}
          </span>
          <span
            className={selectedOption ? "text-[var(--foreground)]" : "text-[var(--muted-2)]"}
          >
            {selectedOption?.label || placeholder}
          </span>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {open && (
          <div
            className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
            role="listbox"
          >
            <button
              type="button"
              onClick={() => {
                triggerChange("");
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === ""
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  triggerChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === option.value
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
