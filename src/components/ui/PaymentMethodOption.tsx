import React from "react";

export type PaymentMethodId = "card" | "mtn" | "telecel" | "ussd";

interface PaymentMethodOptionProps {
  id: PaymentMethodId;
  name: string;
  subtitle?: string;
  badgeContent?: React.ReactNode;
  icon?: string;
  isSelected: boolean;
  onSelect: (id: PaymentMethodId) => void;
}

export const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
  id,
  name,
  subtitle,
  badgeContent,
  icon,
  isSelected,
  onSelect,
}) => {
  return (
    <label
      onClick={() => onSelect(id)}
      className="relative cursor-pointer block group select-none"
    >
      <input
        type="radio"
        name="payment_method"
        value={id}
        checked={isSelected}
        onChange={() => onSelect(id)}
        className="sr-only"
      />
      <div
        className={`border rounded-xl p-3.5 flex items-center justify-between transition-all duration-200 ${
          isSelected
            ? "border-primary-container bg-surface-container-low ring-1 ring-primary-container shadow-sm"
            : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Badge Icon / Logo */}
          {badgeContent ? (
            badgeContent
          ) : (
            <div className="w-10 h-7 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon || "credit_card"}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface leading-tight">
              {name}
            </span>
            {subtitle && (
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Selected Checkmark */}
        <div className="w-6 h-6 flex items-center justify-center">
          <span
            className={`material-symbols-outlined text-[22px] transition-all ${
              isSelected
                ? "text-primary opacity-100 scale-100"
                : "text-outline-variant opacity-30 scale-75"
            }`}
            style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
          >
            check_circle
          </span>
        </div>
      </div>
    </label>
  );
};
