"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { EventCard } from "@/components/ui/EventCard";
import { Event, events as defaultEvents, categoryIcons } from "@/lib/mock-data";
import { fetchAllEvents } from "@/lib/supabase/db";

const categories = [
  { id: "all", label: "All", icon: "confirmation_number" },
  { id: "music", label: "Music", icon: categoryIcons.music },
  { id: "sports", label: "Sports", icon: categoryIcons.sports },
  { id: "arts", label: "Arts", icon: categoryIcons.arts },
  { id: "festivals", label: "Festivals", icon: categoryIcons.festivals },
  { id: "comedy", label: "Comedy", icon: categoryIcons.comedy },
];

export default function SearchPage() {
  const [allEvents, setAllEvents] = useState<Event[]>(defaultEvents);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchMode, setSearchMode] = useState<"name" | "venue" | "city">("name");

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

      if (!searchQuery) return matchesCategory;

      const q = searchQuery.toLowerCase();

      switch (searchMode) {
        case "venue":
          return matchesCategory && event.venue.toLowerCase().includes(q);
        case "city":
          return matchesCategory && event.city.toLowerCase().includes(q);
        default:
          // Search across name, venue, and city for broad matches
          return (
            matchesCategory &&
            (event.title.toLowerCase().includes(q) ||
              event.venue.toLowerCase().includes(q) ||
              event.city.toLowerCase().includes(q))
          );
      }
    });
  }, [allEvents, searchQuery, selectedCategory, searchMode]);

  const recentSearches = ["Neon Nights", "Grand Stadium", "Comedy Cellar", "Accra"];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-8 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="shell" />

      <main className="w-full max-w-[1200px] mx-auto flex-grow px-4">
        {/* Search Header */}
        <section className="pt-4 pb-2">
          <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-black text-on-surface mb-3">
            Search Events
          </h1>

          {/* Search Input */}
          <div className="relative w-full group mb-3">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors z-20 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchMode === "venue"
                  ? "Search by venue name..."
                  : searchMode === "city"
                  ? "Search by city..."
                  : "Search events, venues, cities..."
              }
              autoFocus
              className="w-full h-12 pl-12 pr-10 bg-surface-container-lowest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container/50 text-sm text-on-surface placeholder:text-on-surface-variant transition-all shadow-sm focus:outline-none"
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

          {/* Search Mode Tabs */}
          <div className="flex gap-2 mb-3">
            {(["name", "venue", "city"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSearchMode(mode)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                  searchMode === mode
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high"
                }`}
              >
                {mode === "name" ? "Event Name" : mode === "venue" ? "Venue" : "City"}
              </button>
            ))}
          </div>

          {/* Quick Category Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 snap-start ${
                  selectedCategory === cat.id
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container-high active:scale-95"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{
                    fontVariationSettings:
                      selectedCategory === cat.id ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Search Landing State (when no query is entered yet) */}
        {!searchQuery.trim() ? (
          <section className="py-6 flex flex-col items-center justify-center text-center">
            {/* Popular Searches */}
            <div className="w-full mb-6">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 text-left">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest rounded-full border border-outline-variant/60 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px] text-primary">trending_up</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State Prompt */}
            <div className="bg-surface-container-lowest/80 rounded-2xl p-8 border border-outline-variant/40 w-full max-w-md my-4 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/30 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px]">
                  manage_search
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                Search 2026 Events in Ghana
              </h2>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs leading-relaxed">
                Start typing an event name, venue (e.g. &ldquo;Grand Stadium&rdquo;), or city to see live results as you type.
              </p>
            </div>
          </section>
        ) : (
          /* Active Live Search Results */
          <section className="pb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                Results for &ldquo;{searchQuery}&rdquo;
              </h3>
              <span className="text-xs text-primary font-bold">
                {filteredEvents.length} {filteredEvents.length === 1 ? "match" : "matches"} found
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/50 my-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-60 mb-2">
                  event_busy
                </span>
                <p className="font-bold text-on-surface">No events found</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {searchMode === "venue"
                    ? "Try a different venue name or switch to a broader search mode."
                    : searchMode === "city"
                    ? "No events in this city. Try searching by event name instead."
                    : "Try searching with a different keyword or category."}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSearchMode("name");
                  }}
                  className="mt-3 text-primary text-xs font-bold underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 animate-in fade-in duration-200">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
