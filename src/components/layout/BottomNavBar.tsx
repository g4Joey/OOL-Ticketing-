"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const isExplore = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isTickets = pathname.startsWith("/confirmation") || (pathname === "/dashboard" && false);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-3 py-2 bg-secondary shadow-lg max-w-[480px] mx-auto border-t border-secondary-fixed/20">
      {/* Explore */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-all ${
          isExplore
            ? "bg-primary-container text-on-primary-container rounded-xl px-4 py-1 scale-100 shadow-sm"
            : "text-on-secondary px-3 py-1 opacity-80 hover:opacity-100 active:scale-95"
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px] mb-0.5"
          style={{ fontVariationSettings: isExplore ? "'FILL' 1" : "'FILL' 0" }}
        >
          explore
        </span>
        <span className="text-[11px] font-bold tracking-tight">Explore</span>
      </Link>

      {/* Search */}
      <Link
        href="/#search-bar"
        className="flex flex-col items-center justify-center text-on-secondary px-3 py-1 opacity-80 hover:opacity-100 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">search</span>
        <span className="text-[11px] font-bold tracking-tight">Search</span>
      </Link>

      {/* Tickets */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center transition-all ${
          isTickets
            ? "bg-primary-container text-on-primary-container rounded-xl px-4 py-1 scale-100 shadow-sm"
            : "text-on-secondary px-3 py-1 opacity-80 hover:opacity-100 active:scale-95"
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px] mb-0.5"
          style={{ fontVariationSettings: isTickets ? "'FILL' 1" : "'FILL' 0" }}
        >
          confirmation_number
        </span>
        <span className="text-[11px] font-bold tracking-tight">Tickets</span>
      </Link>

      {/* Dashboard */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center transition-all ${
          isDashboard
            ? "bg-primary-container text-on-primary-container rounded-xl px-4 py-1 scale-100 shadow-sm"
            : "text-on-secondary px-3 py-1 opacity-80 hover:opacity-100 active:scale-95"
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px] mb-0.5"
          style={{ fontVariationSettings: isDashboard ? "'FILL' 1" : "'FILL' 0" }}
        >
          dashboard
        </span>
        <span className="text-[11px] font-bold tracking-tight">Dashboard</span>
      </Link>
    </nav>
  );
};
