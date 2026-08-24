"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopAppBarProps {
  variant?: "shell" | "task";
  title?: string;
  onBack?: () => void;
  showShare?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  variant = "shell",
  title = "VibePass",
  onBack,
  showShare = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || "VibePass Event",
          url: window.location.href,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    }
  };

  if (variant === "task") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant max-w-[480px] md:max-w-3xl mx-auto transition-colors">
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -ml-2 transition-colors active:scale-95 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        <h1 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-primary truncate max-w-[220px] text-center">
          {title}
        </h1>

        <div className="w-10 flex justify-end">
          {showShare ? (
            <button
              onClick={handleShare}
              aria-label="Share Event"
              className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -mr-2 transition-colors active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-6 h-16 bg-surface border-b border-outline-variant max-w-[1200px] mx-auto transition-colors">
      <Link
        href="/dashboard"
        className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -ml-2 transition-colors active:scale-95 flex items-center justify-center"
        aria-label="Tickets"
      >
        <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
      </Link>

      <Link href="/" className="font-[family-name:var(--font-montserrat)] text-xl md:text-2xl font-bold text-primary tracking-tight">
        VibePass
      </Link>

      <Link
        href="/dashboard"
        className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -mr-2 transition-colors active:scale-95 flex items-center justify-center"
        aria-label="Account"
      >
        <span className="material-symbols-outlined text-[26px]">account_circle</span>
      </Link>
    </header>
  );
};
