"use client";

import React from "react";

interface CategoryChipProps {
  label: string;
  icon: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
        isActive
          ? "bg-primary text-on-primary shadow-md"
          : "bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
      }`}
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};
