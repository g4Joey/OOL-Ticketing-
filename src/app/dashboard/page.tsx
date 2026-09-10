"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { TicketCard } from "@/components/ui/TicketCard";
import { currentUser, activeTickets } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export default function UserDashboardPage() {
  const { user: authUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [user, setUser] = useState(currentUser);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        fullName: authUser.fullName,
        avatarUrl: authUser.avatarUrl,
        loyaltyPoints: authUser.loyaltyPoints,
        status: authUser.status,
      });
    }
  }, [authUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (mounted && (!isAuthenticated || !authUser)) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 pt-16 selection:bg-primary-container selection:text-on-primary-container">
        <TopAppBar variant="shell" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-[440px] mx-auto w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[36px]">person_off</span>
          </div>
          <h2 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-on-surface mb-1">
            You Are Not Signed In
          </h2>
          <p className="text-xs text-on-surface-variant max-w-xs mb-6 leading-relaxed">
            Sign in or create an account to view your active tickets, loyalty points, and profile information.
          </p>
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/auth/login?redirect=/dashboard"
              className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] text-center"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup?redirect=/dashboard"
              className="w-full py-3 bg-primary-container text-on-primary-container font-bold text-sm rounded-xl hover:bg-primary-fixed-dim transition-all active:scale-[0.98] text-center"
            >
              Create Account
            </Link>
          </div>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-outline-variant/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      <TopAppBar variant="shell" />

      <main className="flex-1 flex flex-col p-4 max-w-[480px] md:max-w-xl mx-auto w-full gap-3">
        {/* Profile Header */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/50 flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
              <span className="material-symbols-outlined text-[12px]">
                verified
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
              {user.fullName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-tertiary text-on-tertiary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {user.status} Status
              </span>
              <span className="text-on-surface-variant text-xs font-semibold">
                {user.loyaltyPoints.toLocaleString()} pts
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast("Edit Profile feature coming in Phase 4")}
            aria-label="Edit Profile"
            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </section>

        {/* My Tickets Section */}
        <section className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-end px-1">
            <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
              My Tickets
            </h3>
            <button
              onClick={() => showToast("Showing all 1 active tickets")}
              className="text-xs font-bold text-primary hover:underline"
            >
              View All ({activeTickets.length})
            </button>
          </div>

          {/* Active Ticket Card with QR Code modal */}
          {activeTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </section>

        {/* Bento Grid Actions (Sell Tickets & Past Events) */}
        <section className="grid grid-cols-2 gap-2.5 mt-2">
          {/* Sell Tickets */}
          <button
            onClick={() =>
              showToast("P2P Ticket Resale Marketplace opens 48hrs before events.")
            }
            className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant flex flex-col items-start gap-2 hover:bg-surface-container transition-all active:scale-95 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">
                sell
              </span>
            </div>
            <div>
              <h4 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface">
                Sell Tickets
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                List unused passes safely for MoMo cash.
              </p>
            </div>
          </button>

          {/* Past Events */}
          <button
            onClick={() => showToast("No past event history recorded yet.")}
            className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant flex flex-col items-start gap-2 hover:bg-surface-container transition-all active:scale-95 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">
                history
              </span>
            </div>
            <div>
              <h4 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface">
                Past Events
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                Relive memories & past receipts.
              </p>
            </div>
          </button>
        </section>

        {/* Settings List */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden mt-1">
          <ul className="flex flex-col divide-y divide-outline-variant/30 text-xs">
            {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 p-3.5 hover:bg-primary-container/20 transition-colors text-left group"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  admin_panel_settings
                </span>
                <div className="flex-1">
                  <span className="font-bold text-primary text-xs block">
                    Admin Operations Portal
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    Create events, set categories, view audit logs
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </Link>
            </li>
            )}
            <li>
              <button
                onClick={() => showToast("Account settings opened")}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  settings
                </span>
                <span className="flex-1 font-semibold text-on-surface text-xs">
                  Account Settings
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  chevron_right
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => showToast("Payment Methods opened")}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  payment
                </span>
                <span className="flex-1 font-semibold text-on-surface text-xs">
                  Payment Methods & Wallets
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  chevron_right
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  showToast("Support line: 24/7 WhatsApp & MoMo Help Desk")
                }
                className="w-full flex items-center gap-3 p-3.5 hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  support_agent
                </span>
                <span className="flex-1 font-semibold text-on-surface text-xs">
                  Help & 24/7 Support
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  chevron_right
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  showToast("Signed out successfully");
                }}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-error-container/30 transition-colors text-left text-error cursor-pointer border-t border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[20px] text-error">
                  logout
                </span>
                <span className="flex-1 font-bold text-xs">
                  Sign Out of VibePass
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </li>
          </ul>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
