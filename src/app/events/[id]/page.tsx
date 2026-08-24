"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Event, events as defaultEvents, featuredEvent, formatCurrency, formatPrice } from "@/lib/mock-data";
import { fetchEventById } from "@/lib/supabase/db";
import { useAuth } from "@/lib/auth-context";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const initialEvent =
    defaultEvents.find((e) => e.id === resolvedParams.id) ||
    (resolvedParams.id === featuredEvent.id ? featuredEvent : defaultEvents[0]);

  const [event, setEvent] = useState<Event>(initialEvent);
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false);

  // Multi-tier Cart State: map of tierId -> quantity
  const [cartTiers, setCartTiers] = useState<Record<string, number>>({
    [initialEvent.tiers[0]?.id || "tier-1"]: 1,
  });

  useEffect(() => {
    async function loadEvent() {
      try {
        const liveEvent = await fetchEventById(resolvedParams.id);
        if (liveEvent) {
          setEvent(liveEvent);
          if (liveEvent.tiers.length > 0 && Object.keys(cartTiers).length === 0) {
            setCartTiers({ [liveEvent.tiers[0].id]: 1 });
          }
        }
      } catch (err) {
        console.warn("Using initial event data:", err);
      }
    }
    loadEvent();
  }, [resolvedParams.id]);

  const updateTierQuantity = (tierId: string, delta: number) => {
    setCartTiers((prev) => {
      const currentQty = prev[tierId] || 0;
      const newQty = Math.max(0, Math.min(10, currentQty + delta));
      const updated = { ...prev, [tierId]: newQty };
      if (newQty === 0) {
        delete updated[tierId];
      }
      return updated;
    });
  };

  // Calculate total tickets and grand total across all tiers
  const totalTicketCount = Object.values(cartTiers).reduce((sum, q) => sum + q, 0);

  const totalCartPrice = Object.entries(cartTiers).reduce((sum, [tierId, qty]) => {
    const tier = event.tiers.find((t) => t.id === tierId);
    return sum + (tier ? tier.price * qty : 0);
  }, 0);

  // Build Cart Summary String (e.g. "1x VIP Pass, 2x General")
  const cartSummaryLabel = Object.entries(cartTiers)
    .filter(([_, qty]) => qty > 0)
    .map(([tierId, qty]) => {
      const tier = event.tiers.find((t) => t.id === tierId);
      return `${qty}x ${tier?.tierLabel || "Ticket"}`;
    })
    .join(", ");

  const handleProceedToCheckout = () => {
    if (totalTicketCount === 0) {
      alert("Please select at least 1 ticket to proceed.");
      return;
    }

    const cartPayload = encodeURIComponent(JSON.stringify(cartTiers));
    const checkoutUrl = `/checkout?eventId=${event.id}&cart=${cartPayload}&count=${totalTicketCount}&subtotal=${totalCartPrice}`;

    // Auth Gating: If not logged in, redirect to stylish Signup page first
    if (!isAuthenticated) {
      router.push(`/auth/signup?redirect=${encodeURIComponent(checkoutUrl)}`);
    } else {
      router.push(checkoutUrl);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative pb-32 pt-16 selection:bg-primary-container selection:text-on-primary-container">
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
              className="text-primary text-xs font-bold flex items-center gap-1 hover:text-on-primary-container transition-colors mt-2 cursor-pointer"
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

          {/* Multi-Tier Ticket Selection Area */}
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center mt-1">
              <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                Select Tickets
              </h2>
              <span className="text-[11px] text-secondary font-bold">
                Mix & match tiers
              </span>
            </div>

            {event.tiers.map((tier) => {
              const qty = cartTiers[tier.id] || 0;
              const isSelected = qty > 0;
              const isLowStock = tier.available && tier.available < 15;

              return (
                <div
                  key={tier.id}
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
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-extrabold text-tertiary uppercase tracking-wider">
                            {tier.tierLabel}
                          </span>
                          {tier.available !== undefined && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                                isLowStock
                                  ? "bg-error/15 text-error"
                                  : "bg-surface-container text-on-surface-variant"
                              }`}
                            >
                              {tier.available} tickets left
                            </span>
                          )}
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

                    <p className="text-xs text-on-surface-variant mb-3">
                      {tier.description}
                    </p>

                    {/* Independent Quantity Stepper for this tier */}
                    <div className="mt-auto pt-2 border-t border-dashed border-outline-variant/40 flex items-center justify-between">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {qty > 0 ? (
                          <strong className="text-primary font-bold">
                            {qty} × {formatPrice(tier.price)} = {formatCurrency(qty * tier.price)}
                          </strong>
                        ) : (
                          "Select quantity"
                        )}
                      </span>

                      <div className="flex items-center gap-2 bg-surface-container rounded-lg p-1 border border-outline-variant/40">
                        <button
                          type="button"
                          onClick={() => updateTierQuantity(tier.id, -1)}
                          disabled={qty <= 0}
                          className="w-7 h-7 bg-surface-container-lowest text-on-surface rounded-md flex items-center justify-center font-bold hover:bg-surface-container-high active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>

                        <span className="font-[family-name:var(--font-montserrat)] text-sm font-extrabold text-on-surface min-w-[20px] text-center">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateTierQuantity(tier.id, 1)}
                          disabled={qty >= (tier.available || 10)}
                          className="w-7 h-7 bg-primary text-on-primary rounded-md flex items-center justify-center font-bold hover:bg-on-primary-fixed-variant active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      {/* Sticky Bottom Action Bar with Combined Cart Total */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.06)] max-w-[480px] md:max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="text-xs text-on-surface-variant font-medium truncate max-w-[220px]">
            {totalTicketCount > 0 ? cartSummaryLabel : "Select tickets to continue"}
          </div>
          <div className="font-[family-name:var(--font-montserrat)] text-base font-black text-on-surface">
            {formatCurrency(totalCartPrice, "GHS")}
          </div>
        </div>

        <button
          onClick={handleProceedToCheckout}
          disabled={totalTicketCount === 0}
          className="w-full bg-primary-container text-on-primary-fixed font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 active:bg-primary-fixed-dim hover:opacity-95 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>
            {isAuthenticated ? "Proceed to Checkout" : "Sign Up & Checkout"}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
