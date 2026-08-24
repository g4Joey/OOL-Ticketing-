"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { events, featuredEvent, formatCurrency, formatPrice } from "@/lib/mock-data";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Look up event from mock data or fallback to featured event
  const event =
    events.find((e) => e.id === resolvedParams.id) ||
    (resolvedParams.id === featuredEvent.id ? featuredEvent : events[0]);

  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.tiers[0]?.id || ""
  );
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false);

  const selectedTier =
    event.tiers.find((t) => t.id === selectedTierId) || event.tiers[0];

  const handleProceedToCheckout = () => {
    router.push(
      `/checkout?eventId=${event.id}&tierId=${selectedTier.id}&qty=1`
    );
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative pb-28 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <TopAppBar variant="task" title={event.title} showShare={true} />

      <main className="flex-1 flex flex-col max-w-[480px] md:max-w-xl mx-auto w-full">
        {/* Hero Section */}
        <section className="relative w-full h-72 md:h-80 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Status Badge */}
          {event.isSellingFast && (
            <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary text-[11px] font-extrabold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
              <span>Selling Fast</span>
            </div>
          )}

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 text-white">
            <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-extrabold mb-1 drop-shadow-md leading-tight">
              {event.title}
            </h1>
            <p className="text-xs text-surface-container-low flex items-center gap-1 opacity-90">
              <span className="material-symbols-outlined text-[15px] text-primary-container">
                location_on
              </span>
              <span>
                {event.venue}, {event.city}
              </span>
            </p>
          </div>
        </section>

        {/* Trust Banner */}
        <div className="bg-secondary text-on-secondary py-2 px-4 flex justify-center items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[15px] text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span>Verified Seller</span>
          </div>
          <div className="w-1 h-1 bg-outline-variant rounded-full" />
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[15px] text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span>Instant MoMo Delivery</span>
          </div>
        </div>

        {/* Body Container */}
        <div className="px-4 py-3 flex flex-col gap-3">
          {/* Date & Time Card */}
          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant flex items-center gap-3.5">
            <div className="bg-surface-container w-12 h-12 rounded-lg flex flex-col items-center justify-center text-primary shrink-0 border border-outline-variant/30">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                OCT
              </span>
              <span className="font-[family-name:var(--font-montserrat)] text-base font-extrabold leading-none mt-0.5">
                24
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">
                {event.date}
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                Doors open at {event.doorsOpen}
              </div>
            </div>
          </div>

          {/* About Section */}
          <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant">
            <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface mb-2">
              About the Event
            </h2>
            <p
              className={`text-xs text-on-surface-variant leading-relaxed ${
                isAboutExpanded ? "" : "line-clamp-3"
              }`}
            >
              {event.description}
            </p>
            <button
              type="button"
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:text-on-primary-container transition-colors mt-2"
            >
              <span>{isAboutExpanded ? "Show Less" : "Read More"}</span>
              <span
                className={`material-symbols-outlined text-[16px] transition-transform ${
                  isAboutExpanded ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
          </section>

          {/* Ticket Selection Area */}
          <section className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center mt-1">
              <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                Select Tickets
              </h2>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Instant delivery to app & SMS
              </span>
            </div>

            {event.tiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <label
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className="block relative cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="ticket_type"
                    value={tier.id}
                    checked={isSelected}
                    onChange={() => setSelectedTierId(tier.id)}
                    className="sr-only"
                  />

                  {/* Card Body */}
                  <div
                    className={`bg-surface-container-lowest rounded-xl shadow-sm border-2 overflow-hidden transition-all flex ${
                      isSelected
                        ? "border-primary ring-1 ring-primary/20 shadow-md"
                        : "border-outline-variant hover:border-outline"
                    }`}
                  >
                    {/* Tear-off edge visual */}
                    <div className="w-3 border-r-2 border-dashed border-outline-variant bg-surface-container flex flex-col justify-between py-2 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-background -ml-1" />
                      <div className="w-1.5 h-1.5 rounded-full bg-background -ml-1" />
                      <div className="w-1.5 h-1.5 rounded-full bg-background -ml-1" />
                      <div className="w-1.5 h-1.5 rounded-full bg-background -ml-1" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3.5 flex flex-col relative">
                      {/* Selected Checkmark */}
                      <div className="absolute top-3 right-3 text-primary">
                        <span
                          className={`material-symbols-outlined text-[20px] transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      </div>

                      <div className="flex justify-between items-start mb-1 pr-6">
                        <div>
                          <div className="text-[10px] font-extrabold text-tertiary uppercase tracking-wider mb-0.5">
                            {tier.tierLabel}
                          </div>
                          <h3 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface">
                            {tier.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="font-[family-name:var(--font-montserrat)] text-base font-extrabold text-on-surface">
                            {formatPrice(tier.price, tier.currency)}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-on-surface-variant pr-6">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </section>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.06)] max-w-[480px] md:max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="text-xs text-on-surface-variant font-medium">
            1x {selectedTier.tierLabel} ({selectedTier.name})
          </div>
          <div className="font-[family-name:var(--font-montserrat)] text-base font-black text-on-surface">
            {formatCurrency(selectedTier.price, selectedTier.currency)}
          </div>
        </div>

        <button
          onClick={handleProceedToCheckout}
          className="w-full bg-primary-container text-on-primary-fixed font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 active:bg-primary-fixed-dim hover:opacity-95 transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
