"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Event, events as defaultEvents, formatCurrency } from "@/lib/mock-data";
import { fetchAllEvents } from "@/lib/supabase/db";

export default function AdminDashboardPage() {
  const [eventsList, setEventsList] = useState<Event[]>(defaultEvents);
  const [adminEmail] = useState("admin@vibepass.com");

  useEffect(() => {
    async function loadData() {
      try {
        const liveEvents = await fetchAllEvents();
        if (liveEvents && liveEvents.length > 0) {
          setEventsList(liveEvents);
        }
      } catch (err) {
        console.warn("Using local events list:", err);
      }
    }
    loadData();
  }, []);

  // Compute stats
  const totalEvents = eventsList.length;
  const totalCapacity = eventsList.reduce(
    (acc, e) => acc + e.tiers.reduce((tAcc, t) => tAcc + (t.available || 0), 0),
    0
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-12 selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <TopAppBar variant="task" title="Admin Operations Portal" />

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-4">
        {/* Admin Header Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-on-primary text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                SUPER ADMIN
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Logged in as <strong className="text-on-surface">{adminEmail}</strong>
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-montserrat)] text-xl md:text-2xl font-black text-on-surface mt-1.5">
              Event Management & Operations
            </h1>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/admin/events/new"
              className="flex-1 sm:flex-none bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-on-primary-fixed-variant transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create Event</span>
            </Link>

            <Link
              href="/admin/logs"
              className="flex-1 sm:flex-none bg-surface-container text-on-surface font-[family-name:var(--font-montserrat)] text-xs font-bold px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Audit Logs</span>
            </Link>
          </div>
        </section>

        {/* Analytics Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              Active Events (2026)
            </span>
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-primary mt-0.5">
              {totalEvents}
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              Gross Volume (GHS)
            </span>
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface mt-0.5">
              ₵48,250
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              Tickets Sold
            </span>
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-tertiary mt-0.5">
              342 passes
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              Available Capacity
            </span>
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface-variant mt-0.5">
              {totalCapacity.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Events Catalog Table / Cards */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-3">
            <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
              Live Event Catalog
            </h2>
            <Link
              href="/admin/events/new"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>+ Add New Event</span>
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-outline-variant/30">
            {eventsList.map((event) => (
              <div
                key={event.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-variant shrink-0 border border-outline-variant/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.2 rounded capitalize">
                        {event.category}
                      </span>
                      {event.isSellingFast && (
                        <span className="bg-error/10 text-error text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Selling Fast
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface hover:text-primary transition-colors mt-0.5 block"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-on-surface-variant">
                      {event.date} • {event.venue}, {event.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 pl-16 sm:pl-0">
                  <div className="text-right mr-1">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      Tiers ({event.tiers.length})
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-xs font-bold text-on-surface">
                      {event.tiers.map((t) => `${formatCurrency(t.price)} (${t.tierLabel})`).join(" • ")}
                    </span>
                  </div>

                  <Link
                    href={`/admin/events/${event.id}`}
                    className="p-2 bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    <span>Manage</span>
                  </Link>

                  <Link
                    href={`/events/${event.id}`}
                    target="_blank"
                    className="p-2 bg-surface-container rounded-lg text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
