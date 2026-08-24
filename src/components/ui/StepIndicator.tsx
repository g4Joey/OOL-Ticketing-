import React from "react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between py-2 mb-2 w-full">
      {/* Step 1: INFO */}
      <div className="flex flex-col items-center gap-1 w-1/3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep >= 1
              ? "bg-primary text-on-primary"
              : "bg-surface-variant text-on-surface-variant"
          }`}
        >
          {currentStep > 1 ? (
            <span className="material-symbols-outlined text-[14px]">check</span>
          ) : (
            "1"
          )}
        </div>
        <span
          className={`text-[11px] font-bold tracking-wider ${
            currentStep >= 1 ? "text-primary" : "text-on-surface-variant opacity-60"
          }`}
        >
          INFO
        </span>
      </div>

      {/* Connector 1 */}
      <div
        className={`h-[2px] flex-grow mx-2 transition-colors ${
          currentStep >= 2 ? "bg-primary" : "bg-surface-variant"
        }`}
      />

      {/* Step 2: PAY */}
      <div className="flex flex-col items-center gap-1 w-1/3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            currentStep === 2
              ? "bg-primary-container text-on-primary-container ring-4 ring-primary-container/20 font-black"
              : currentStep > 2
              ? "bg-primary text-on-primary"
              : "bg-surface-variant text-on-surface-variant opacity-60"
          }`}
        >
          {currentStep > 2 ? (
            <span className="material-symbols-outlined text-[14px]">check</span>
          ) : (
            "2"
          )}
        </div>
        <span
          className={`text-[11px] font-bold tracking-wider ${
            currentStep === 2
              ? "text-on-surface font-extrabold"
              : currentStep > 2
              ? "text-primary"
              : "text-on-surface-variant opacity-60"
          }`}
        >
          PAY
        </span>
      </div>

      {/* Connector 2 */}
      <div
        className={`h-[2px] flex-grow mx-2 transition-colors ${
          currentStep >= 3 ? "bg-primary" : "bg-surface-variant"
        }`}
      />

      {/* Step 3: DONE */}
      <div
        className={`flex flex-col items-center gap-1 w-1/3 transition-opacity ${
          currentStep === 3 ? "opacity-100" : "opacity-50"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep === 3
              ? "bg-primary-container text-on-primary-container ring-4 ring-primary-container/20 font-black"
              : "bg-surface-variant text-on-surface-variant"
          }`}
        >
          {currentStep === 3 ? (
            <span className="material-symbols-outlined text-[14px]">check</span>
          ) : (
            "3"
          )}
        </div>
        <span className="text-[11px] font-bold tracking-wider text-on-surface-variant">
          DONE
        </span>
      </div>
    </div>
  );
};
