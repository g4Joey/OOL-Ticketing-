"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { useResale } from "@/lib/resale-context";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/mock-data";

export default function MarketplacePage() {
  const { getApprovedListings, markAsSold } = useResale();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const approvedListings = useMemo(() => {
    if (!mounted) return [];
    return getApprovedListings();
  }, [mounted, getApprovedListings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyTicket = (listingId: string) => {
    if (!isAuthenticated) {
      showToast("Please sign in to buy resale tickets.");
      return;
    }
    markAsSold(listingId);
    showToast("Ticket purchased! Check your tickets page.");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-8 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="shell" />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-4">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/10 via-tertiary/5 to-secondary/10 rounded-2xl p-5 border border-outline-variant/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-black text-on-surface">
                Ticket Marketplace
              </h1>
              <p className="text-xs text-on-surface-variant">
                Verified resale tickets from other VibePass users
              </p>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-primary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Admin Verified
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-tertiary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              Buyer Protected
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-secondary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>swap_horiz</span>
              Secure Transfer
            </div>
          </div>
        </section>

        {/* Listings */}
        {!mounted ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : approvedListings.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/50 mt-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-60 mb-2">
              storefront
            </span>
            <p className="font-bold text-on-surface">No resale tickets available</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Check back later — sellers list tickets here when they can&apos;t make an event.
            </p>
            <Link
              href="/"
              className="mt-3 inline-block bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-on-primary-fixed-variant transition-colors"
            >
              Browse Official Events
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {approvedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Resale Badge Header */}
                <div className="px-4 py-2 bg-tertiary/5 flex items-center justify-between border-b border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      sell
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-tertiary">
                      Resale by User
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-[10px] font-bold text-primary">Admin Approved</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                  <h3 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface mb-1">
                    {listing.eventTitle}
                  </h3>

                  <div className="flex flex-col gap-1 mb-3">
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
                      {listing.eventDate}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                      {listing.venue}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">style</span>
                      {listing.tierLabel}
                    </p>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3 bg-surface-container rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface">{listing.sellerName}</p>
                      <p className="text-[10px] text-on-surface-variant">Listed {new Date(listing.listedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Tear */}
                <div className="ticket-border ticket-tear mx-4" />

                {/* Price & Buy */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Asking Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-montserrat)] text-xl font-black text-primary">
                        {formatCurrency(listing.askingPrice)}
                      </span>
                      {listing.originalPrice && listing.askingPrice < listing.originalPrice && (
                        <span className="text-[10px] text-on-surface-variant line-through">
                          {formatCurrency(listing.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyTicket(listing.id)}
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
