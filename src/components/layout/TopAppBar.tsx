"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        // cancelled
      }
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const isUserLoggedIn = mounted && isAuthenticated;

  if (variant === "task") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant max-w-[480px] md:max-w-4xl mx-auto transition-colors">
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -ml-2 transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        <h1 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-primary truncate max-w-[240px] text-center">
          {title}
        </h1>

        <div className="w-10 flex justify-end relative" ref={menuRef}>
          {showShare ? (
            <button
              onClick={handleShare}
              aria-label="Share Event"
              className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -mr-2 transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -mr-2 transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
            </button>
          )}

          {/* Profile Dropdown Menu in Task Mode */}
          {isMenuOpen && !showShare && (
            <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {isUserLoggedIn && user ? (
                <div className="p-2.5 border-b border-outline-variant/40 mb-1">
                  <div className="font-bold text-xs text-on-surface truncate">{user.fullName}</div>
                  <div className="text-[11px] text-on-surface-variant truncate">{user.email}</div>
                  <span className="inline-block mt-1 bg-tertiary-container text-on-tertiary-container text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                    {user.role === "admin" ? "Admin Access" : `${user.status} Status`}
                  </span>
                </div>
              ) : (
                <div className="p-2.5 border-b border-outline-variant/40 mb-1 text-xs text-on-surface-variant">
                  Welcome to VibePass
                </div>
              )}

              <div className="flex flex-col gap-1 text-xs">
                {isUserLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container text-on-surface font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">confirmation_number</span>
                      <span>My Tickets & Passes</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container text-on-surface font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">admin_panel_settings</span>
                      <span>Admin Portal</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-error/10 text-error font-semibold text-left w-full cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-primary text-on-primary font-bold text-center justify-center"
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface font-bold text-center justify-center"
                    >
                      <span>Create Free Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
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

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 -mr-2 transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label="User Account"
        >
          {isUserLoggedIn && user?.avatarUrl ? (
            <div className="w-7 h-7 rounded-full overflow-hidden border border-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <span className="material-symbols-outlined text-[26px]">account_circle</span>
          )}
        </button>

        {/* Profile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            {isUserLoggedIn && user ? (
              <div className="p-2.5 border-b border-outline-variant/40 mb-1">
                <div className="font-bold text-xs text-on-surface truncate">{user.fullName}</div>
                <div className="text-[11px] text-on-surface-variant truncate">{user.email}</div>
                <span className="inline-block mt-1 bg-tertiary-container text-on-tertiary-container text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                  {user.role === "admin" ? "Admin Access" : `${user.status} Status`}
                </span>
              </div>
            ) : (
              <div className="p-2.5 border-b border-outline-variant/40 mb-1 text-xs text-on-surface-variant font-medium">
                Welcome to VibePass
              </div>
            )}

            <div className="flex flex-col gap-1 text-xs">
              {isUserLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container text-on-surface font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">confirmation_number</span>
                    <span>My Tickets & Wallet</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container text-on-surface font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">admin_panel_settings</span>
                    <span>Admin Operations Portal</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-error/10 text-error font-semibold text-left w-full cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-primary text-on-primary font-bold text-center justify-center shadow-sm"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface font-bold text-center justify-center"
                  >
                    <span>Create Free Account</span>
                  </Link>
                  <div className="border-t border-outline-variant/30 my-1" />
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-[11px]"
                  >
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Organizer / Admin Access</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
