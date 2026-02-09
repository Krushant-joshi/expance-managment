"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ExpenseActions() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const actions = [
    {
      id: "view",
      icon: Eye,
      label: "View Details",
      color: "indigo",
      hoverBg: "hover:bg-indigo-50",
      hoverText: "hover:text-indigo-600",
      activeBg: "active:bg-indigo-100",
    },
    {
      id: "edit",
      icon: Pencil,
      label: "Edit",
      color: "amber",
      hoverBg: "hover:bg-amber-50",
      hoverText: "hover:text-amber-600",
      activeBg: "active:bg-amber-100",
    },
    {
      id: "delete",
      icon: Trash2,
      label: "Delete",
      color: "rose",
      hoverBg: "hover:bg-rose-50",
      hoverText: "hover:text-rose-600",
      activeBg: "active:bg-rose-100",
    },
  ];

  return (
    <div className="flex gap-1.5">
      {actions.map((action) => {
        const Icon = action.icon;
        const isHovered = hoveredAction === action.id;

        return (
          <div key={action.id} className="relative group">
            <button
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              className={`
                relative p-2 rounded-lg
                text-gray-400 
                ${action.hoverBg} 
                ${action.hoverText}
                ${action.activeBg}
                transition-all duration-300
                hover:shadow-md
                hover:scale-110
                active:scale-95
                border border-transparent
                hover:border-${action.color}-200
              `}
              aria-label={action.label}
            >
              <Icon
                size={16}
                className={`transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
              />
            </button>

            {/* Tooltip */}
            <div
              className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                px-3 py-1.5 rounded-lg
                bg-gray-900 text-white text-xs font-medium
                whitespace-nowrap shadow-lg
                pointer-events-none
                transition-all duration-200
                ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
              `}
            >
              {action.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
