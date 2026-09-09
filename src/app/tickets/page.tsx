"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { useAuth } from "@/lib/auth-context";
import { useResale } from "@/lib/resale-context";
import { activeTickets, ActiveTicket, formatCurrency } from "@/lib/mock-data";
import { QRModal } from "@/components/ui/QRModal";

export default function TicketsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { listForResale, getMyListings } = useResale();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [resaleModalTicket, setResaleModalTicket] = useState<ActiveTicket | null>(null);
  const [selectedQRModalTicket, setSelectedQRModalTicket] = useState<ActiveTicket | null>(null);
  const [askingPrice, setAskingPrice] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login?redirect=/tickets");
    }
  }, [mounted, isAuthenticated, router]);

  // Mock data: split tickets into upcoming vs past based on a simple heuristic
  // In production, compare event date against Date.now()
  const { upcomingTickets, pastTickets } = useMemo(() => {
    const upcoming: ActiveTicket[] = [];
    const past: ActiveTicket[] = [];

    // For demo: activeTickets are upcoming, plus we add some mock past tickets
    activeTickets.forEach((t) => upcoming.push(t));

    // Mock past tickets for demonstration
    past.push({
      id: "ticket-past-001",
      eventTitle: "Afro Nation Festival 2025",
      date: "Sat, Dec 28, 2025 • 6:00 PM",
      venue: "Accra Sports Stadium",
      section: "General",
      row: "GA",
      seat: "Standing",
      tierLabel: "General",
      isVerified: true,
      isTonight: false,
    });
    past.push({
      id: "ticket-past-002",
      eventTitle: "Comedy Night Live 2025",
      date: "Fri, Nov 15, 2025 • 8:00 PM",
      venue: "National Theatre",
      section: "VIP",
      row: "B",
      seat: "5",
      tierLabel: "VIP",
      isVerified: true,
      isTonight: false,
    });

    return { upcomingTickets: upcoming, pastTickets: past };
  }, []);

  const myResaleListings = user ? getMyListings(user.email) : [];

  const getResaleStatus = (ticketId: string) => {
    return myResaleListings.find((l) => l.ticketId === ticketId);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleListForResale = () => {
    if (!resaleModalTicket || !user || !askingPrice) return;

    listForResale({
      ticketId: resaleModalTicket.id,
      sellerEmail: user.email,
      sellerName: user.fullName,
      eventId: resaleModalTicket.id,
      eventTitle: resaleModalTicket.eventTitle,
      eventDate: resaleModalTicket.date,
      venue: resaleModalTicket.venue,
      tierLabel: resaleModalTicket.tierLabel,
      originalPrice: 150, // Would come from actual ticket data
      askingPrice: parseFloat(askingPrice),
      currency: "GHS",
    });

    setResaleModalTicket(null);
    setAskingPrice("");
    showToast("Ticket listed for resale! Pending admin approval.");
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;
  const isPast = activeTab === "past";

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-8 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="My Tickets" />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-outline-variant/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full gap-4">
        {/* Segment Tabs */}
        <div className="flex bg-surface-container rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              activeTab === "upcoming"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
              Active / Upcoming ({upcomingTickets.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              activeTab === "past"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">history</span>
              Past Events ({pastTickets.length})
            </span>
          </button>
        </div>

        {/* Tickets List */}
        {displayTickets.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/50 mt-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-60 mb-2">
              confirmation_number
            </span>
            <p className="font-bold text-on-surface">No tickets here</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {isPast
                ? "You haven't attended any events yet."
                : "Browse events to find your next experience."}
            </p>
            <Link
              href="/"
              className="mt-3 inline-block bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-on-primary-fixed-variant transition-colors"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayTickets.map((ticket) => {
              const resaleInfo = getResaleStatus(ticket.id);

              return (
                <div
                  key={ticket.id}
                  className={`bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden transition-all ${
                    isPast ? "opacity-70" : ""
                  }`}
                >
                  {/* Ticket Header */}
                  <div className={`px-4 py-3 flex items-center justify-between ${
                    isPast ? "bg-surface-container" : "bg-primary/5"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isPast ? "text-on-surface-variant" : "text-primary"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isPast ? "event_busy" : "confirmation_number"}
                      </span>
                      <span className={`text-[10px] uppercase font-black tracking-wider ${
                        isPast ? "text-on-surface-variant" : "text-primary"
                      }`}>
                        {isPast ? "Event Ended" : ticket.isTonight ? "Tonight!" : "Upcoming"}
                      </span>
                    </div>

                    {/* Tier Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.tierLabel.includes("VIP")
                        ? "bg-tertiary/10 text-tertiary"
                        : "bg-secondary/10 text-secondary"
                    }`}>
                      {ticket.tierLabel}
                    </span>
                  </div>

                  {/* Ticket Body */}
                  <div className="px-4 py-3">
                    <h3 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface mb-1">
                      {ticket.eventTitle}
                    </h3>

                    <div className="flex flex-col gap-1 mb-3">
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
                        {ticket.date}
                      </p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                        {ticket.venue}
                      </p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">chair</span>
                        Section {ticket.section} • Row {ticket.row} • Seat {ticket.seat}
                      </p>
                    </div>

                    {/* Verified Badge */}
                    {ticket.isVerified && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Verified Authentic</span>
                      </div>
                    )}

                    {/* Resale Status Badge */}
                    {resaleInfo && (
                      <div className={`flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        resaleInfo.status === "pending"
                          ? "bg-tertiary-container/30 text-tertiary"
                          : resaleInfo.status === "approved"
                          ? "bg-primary-container/30 text-primary"
                          : resaleInfo.status === "declined"
                          ? "bg-error-container text-error"
                          : "bg-surface-container text-on-surface-variant"
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {resaleInfo.status === "pending" ? "hourglass_top" : resaleInfo.status === "approved" ? "storefront" : resaleInfo.status === "declined" ? "block" : "check_circle"}
                        </span>
                        Resale: {resaleInfo.status === "pending" ? "Pending Admin Approval" : resaleInfo.status === "approved" ? `Listed at ${formatCurrency(resaleInfo.askingPrice)}` : resaleInfo.status === "declined" ? "Declined by Admin" : "Sold!"}
                      </div>
                    )}
                  </div>

                  {/* Ticket Tear */}
                  <div className="ticket-border ticket-tear mx-4" />

                  {/* Ticket Actions */}
                  <div className="px-4 py-3 flex items-center gap-2">
                    {!isPast && (
                      <>
                        <button
                          onClick={() => setSelectedQRModalTicket(ticket)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-on-primary py-2 rounded-lg text-xs font-bold transition-all hover:bg-on-primary-fixed-variant active:scale-95 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          Show QR
                        </button>
                        {!resaleInfo && (
                          <button
                            onClick={() => {
                              setResaleModalTicket(ticket);
                              setAskingPrice("150");
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container text-on-surface py-2 rounded-lg text-xs font-bold border border-outline-variant transition-all hover:bg-surface-container-high active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">sell</span>
                            List for Resale
                          </button>
                        )}
                      </>
                    )}
                    {isPast && (
                      <div className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container text-on-surface-variant py-2 rounded-lg text-xs font-bold">
                        <span className="material-symbols-outlined text-[16px]">event_busy</span>
                        Event Ended
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Resale Modal (Elevated with z-[70] and centered so footer never covers buttons) */}
      {resaleModalTicket && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant/60 animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                List for Resale
              </h3>
              <button
                onClick={() => {
                  setResaleModalTicket(null);
                  setAskingPrice("");
                }}
                className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Ticket Info */}
              <div className="bg-surface-container rounded-xl p-3">
                <p className="text-xs font-bold text-on-surface">{resaleModalTicket.eventTitle}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  {resaleModalTicket.tierLabel} • Section {resaleModalTicket.section}
                </p>
              </div>

              {/* Price Input */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                  Asking Price (GHS)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">₵</span>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    className="w-full h-12 pl-8 pr-4 bg-surface-container-lowest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container/50 text-sm text-on-surface font-bold transition-all focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1.5">
                  💡 Tip: Price competitively for a faster sale. Buyers see your asking price on the marketplace.
                </p>
              </div>

              {/* Info Note */}
              <div className="bg-primary-container/20 rounded-xl p-3 flex gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">info</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Your listing will be reviewed by VibePass admins before appearing on the marketplace. You&apos;ll be notified once approved.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-outline-variant/40 flex gap-2">
              <button
                onClick={() => {
                  setResaleModalTicket(null);
                  setAskingPrice("");
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleListForResale}
                disabled={!askingPrice || parseFloat(askingPrice) <= 0}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-primary text-on-primary shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Show QR */}
      {selectedQRModalTicket && (
        <QRModal
          isOpen={!!selectedQRModalTicket}
          onClose={() => setSelectedQRModalTicket(null)}
          ticketData={{
            eventTitle: selectedQRModalTicket.eventTitle,
            section: selectedQRModalTicket.section,
            row: selectedQRModalTicket.row,
            seat: selectedQRModalTicket.seat,
            date: selectedQRModalTicket.date,
            ticketId: selectedQRModalTicket.id,
          }}
        />
      )}

      <BottomNavBar />
    </div>
  );
}
