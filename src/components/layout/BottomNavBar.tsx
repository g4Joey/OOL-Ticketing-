"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isExplore = pathname === "/" || pathname === "/events" || pathname.startsWith("/events/");
  const isSearch = pathname === "/search";
  const isMarketplace = pathname === "/marketplace";
  const isTickets = pathname === "/tickets";
  const isDashboard = pathname === "/dashboard";

  const allTabs = [
    { href: "/", label: "Explore", icon: "explore", isActive: isExplore, publicOnly: true },
    { href: "/search", label: "Search", icon: "search", isActive: isSearch, publicOnly: true },
    { href: "/marketplace", label: "Market", icon: "storefront", isActive: isMarketplace, publicOnly: true },
    { href: "/tickets", label: "Tickets", icon: "confirmation_number", isActive: isTickets, publicOnly: false },
    { href: "/dashboard", label: "Profile", icon: "person", isActive: isDashboard, publicOnly: false },
  ];

  const visibleTabs = isAuthenticated ? allTabs : allTabs.filter((t) => t.publicOnly);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 bg-secondary shadow-lg max-w-[480px] mx-auto border-t border-secondary-fixed/20">
      {visibleTabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex flex-col items-center justify-center transition-all ${
            tab.isActive
              ? "bg-primary-container text-on-primary-container rounded-xl px-3 py-1 scale-100 shadow-sm"
              : "text-on-secondary px-2.5 py-1 opacity-80 hover:opacity-100 active:scale-95"
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px] mb-0.5"
            style={{ fontVariationSettings: tab.isActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            {tab.icon}
          </span>
          <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
};
