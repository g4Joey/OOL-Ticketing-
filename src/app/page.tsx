"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { EventCard } from "@/components/ui/EventCard";
import { Event, events as defaultEvents, categoryIcons, categoryLabels } from "@/lib/mock-data";
import { fetchAllEvents } from "@/lib/supabase/db";
import { useAuth } from "@/lib/auth-context";
import { WelcomePage } from "@/components/WelcomePage";
const categories = [
  { id: "all", label: "All Events", icon: "confirmation_number" },
  { id: "music", label: "Music Festival", icon: categoryIcons.music },
  { id: "sports", label: "Sports", icon: categoryIcons.sports },
  { id: "arts", label: "Arts & Theatre", icon: categoryIcons.arts },
  { id: "festivals", label: "Cultural Festivals", icon: categoryIcons.festivals },
  { id: "comedy", label: "Comedy", icon: categoryIcons.comedy },
];

function DiscoveryHubContent() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const isBrowsing = searchParams.get("browsing") === "true";

  const [allEvents, setAllEvents] = useState<Event[]>(defaultEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [skipWelcome, setSkipWelcome] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user previously chose to browse
    if (typeof window !== "undefined") {
      const browsed = sessionStorage.getItem("vibepass_browsing");
      if (browsed === "true") setSkipWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (isBrowsing && typeof window !== "undefined") {
      sessionStorage.setItem("vibepass_browsing", "true");
      setSkipWelcome(true);
    }
  }, [isBrowsing]);

  useEffect(() => {
    async function loadData() {
      try {
        const liveEvents = await fetchAllEvents();
        if (liveEvents && liveEvents.length > 0) {
          setAllEvents(liveEvents);
        }
      } catch (err) {
        console.warn("Using local events data:", err);
      }
    }
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allEvents, selectedCategory, searchQuery]);

  // Show welcome page for unauthenticated, first-time visitors
  if (mounted && !isAuthenticated && !skipWelcome) {
    return <WelcomePage />;
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-8 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar with interactive Profile menu */}
      <TopAppBar variant="shell" />

      <main className="w-full max-w-[1200px] mx-auto md:px-4 flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[320px] md:h-[400px] bg-surface-container-high md:rounded-2xl overflow-hidden md:mt-4 mb-4 flex flex-col justify-end">
          {/* Background image with high energy concert */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoj9R8WHYcrwT70fPODbDSPvUi3Irr68HNLOlvFqQFO2GCdMDLlk3RltaVk_BygxijAq8gR4rWAcGkuuNooxPlCxtZpaYNTpl5Ut2YnzQPWIGWFfpYQgwqmhbl7FVril0oLcKJzy8vG8F4rtAKTRqfC5TUGjDLiOSBzzcd-qB3TmTAeUjMU2YPk6anf1kfZUhdpEB6gjZGwZ1v187lXFlfojd6-6AZmzylNtu2EYsjKrs_XIRNW_7eVA')`,
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-on-primary-fixed/95 via-on-primary-fixed/50 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-4 md:p-6 w-full max-w-lg md:max-w-2xl mx-auto text-center">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-2.5 mb-4">
              <div className="flex items-center gap-1.5 bg-secondary/85 backdrop-blur-md text-on-secondary px-3 py-1 rounded-full border border-secondary-fixed/30 text-[11px] font-semibold tracking-wider uppercase shadow-sm">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span>2026 Official Tickets</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/85 backdrop-blur-md text-on-secondary px-3 py-1 rounded-full border border-secondary-fixed/30 text-[11px] font-semibold tracking-wider uppercase shadow-sm">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <span>Instant MoMo Payouts</span>
              </div>
            </div>

            <h2 className="font-[family-name:var(--font-montserrat)] text-2xl md:text-4xl text-on-primary font-extrabold mb-4 drop-shadow-md tracking-tight">
              Secure Your Spot.
            </h2>

            {/* Search Bar */}
            <div id="search-bar" className="relative w-full group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors z-20 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search music festivals, sports, comedy, venues..."
                className="w-full h-12 md:h-14 pl-12 pr-10 bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container/50 text-sm md:text-base text-on-surface placeholder:text-on-surface-variant transition-all shadow-md focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-4 md:px-0 mb-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 pt-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </section>

        {/* Event Grid Section */}
        <section className="px-4 md:px-0 pb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-[family-name:var(--font-montserrat)] text-lg md:text-xl font-bold text-on-surface">
              {selectedCategory === "all"
                ? "Trending 2026 Events"
                : `${categories.find((c) => c.id === selectedCategory)?.label} in Ghana`}
            </h3>
            <span className="text-xs text-on-surface-variant font-medium">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/50 my-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-60 mb-2">
                event_busy
              </span>
              <p className="font-bold text-on-surface">No events found</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Try searching with a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-3 text-primary text-xs font-bold underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Nav Bar */}
      <BottomNavBar />
    </div>
  );
}

export default function DiscoveryHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DiscoveryHubContent />
    </Suspense>
  );
}
