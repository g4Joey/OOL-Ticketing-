"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { sampleOrder, formatCurrency } from "@/lib/mock-data";

export default function TicketConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = resolvedParams.orderId || sampleOrder.reference;
  const eventTitle =
    searchParams.get("eventTitle") || sampleOrder.eventTitle;
  const ticketType =
    searchParams.get("ticketType") || sampleOrder.ticketType;
  const subtotal = parseFloat(
    searchParams.get("subtotal") || sampleOrder.subtotal.toString()
  );
  const fees = parseFloat(
    searchParams.get("fees") || sampleOrder.fees.toString()
  );
  const processingFee = parseFloat(
    searchParams.get("processingFee") || sampleOrder.processingFee.toString()
  );
  const total = parseFloat(
    searchParams.get("total") || sampleOrder.total.toString()
  );
  const email = searchParams.get("email") || "alex@vibepass.com";

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger celebration haptic feedback and confetti on mount
  useEffect(() => {
    // Haptic feedback for mobile devices
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([100, 50, 150, 50, 250]);
      } catch {
        // vibration failed or unsupported
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAppleWallet = () => {
    showToast("✓ Pass added to Apple Wallet!");
  };

  const handlePDFDownload = () => {
    showToast("✓ PDF Ticket downloaded successfully!");
  };

  const handleSMSDelivery = () => {
    showToast(`✓ Ticket SMS sent to verified phone number!`);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-28 relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Confetti Particles (Animated Success celebration) */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              top: "-5%",
              left: `${(i * 100) / 24 + Math.random() * 4}%`,
              opacity: 1,
              scale: Math.random() * 0.7 + 0.5,
              rotate: 0,
            }}
            animate={{
              top: "105%",
              opacity: [1, 1, 0],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              duration: 2.8 + Math.random() * 1.5,
              delay: Math.random() * 0.4,
              ease: "easeOut",
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: [
                "#00ffd1", // primary-container
                "#006b57", // primary
                "#6bff8f", // tertiary-fixed
                "#ffcc00", // mtn yellow
                "#ffffff", // white
                "#3b6751", // secondary
              ][i % 6],
            }}
          />
        ))}
      </div>

      {/* TopAppBar */}
      <TopAppBar variant="task" title="Confirmation" />

      <main className="flex-grow flex flex-col px-4 max-w-[480px] md:max-w-xl mx-auto w-full pt-4">
        {/* Animated Checkmark Success Header */}
        <section className="flex flex-col items-center justify-center text-center mb-4 space-y-3">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.1,
            }}
            className="w-20 h-20 md:w-24 md:h-24 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center shadow-lg ring-8 ring-tertiary-container/30"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 400 }}
              className="material-symbols-outlined text-[48px] md:text-[56px] text-on-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </motion.span>
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-[family-name:var(--font-montserrat)] text-2xl md:text-3xl font-extrabold text-on-background tracking-tight"
            >
              You&apos;re Going!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs md:text-sm text-on-surface-variant mt-1"
            >
              Your order is confirmed and tickets are ready in your wallet.
            </motion.p>
          </div>
        </section>

        {/* Delivery Options Card */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-3 mb-3"
        >
          <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface">
            Delivery Options
          </h2>

          {/* Add to Apple Wallet CTA */}
          <button
            type="button"
            onClick={handleAppleWallet}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 bg-black text-white rounded-xl transition-all active:scale-[0.98] shadow-md hover:bg-neutral-900 cursor-pointer"
          >
            {/* Apple Logo SVG */}
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 170 170"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.53-9.87-11.75-21.34-15.66-34.41-3.91-13.07-5.87-24.93-5.87-35.58 0-14.2 3.65-26.04 10.95-35.53 7.3-9.49 16.59-14.3 27.87-14.42 4.12 0 8.87 1.09 14.25 3.27 5.38 2.18 9.3 3.33 11.76 3.45 2.13-.12 6.07-1.27 11.83-3.45 5.76-2.18 10.42-3.16 13.98-2.94 10.66.54 19.34 4.54 26.04 12.01-9.37 5.66-13.94 13.43-13.71 23.31.23 7.85 3.14 14.51 8.74 19.98 5.6 5.47 12.43 8.52 20.49 9.15-2.07 6.1-4.74 12.27-8.01 18.52zM119.22 31.84c0-5.88 2.05-11.51 6.15-16.89 4.1-5.38 9.3-9.16 15.6-11.35.33 1.09.49 2.29.49 3.6 0 5.88-2.15 11.73-6.45 17.55-4.3 5.82-9.61 9.49-15.93 11.01-.11-1.31-.16-2.39-.16-3.24z" />
            </svg>
            <span className="font-[family-name:var(--font-montserrat)] text-xs font-bold uppercase tracking-wider">
              Add to Apple Wallet
            </span>
          </button>

          <div className="w-full h-px bg-outline-variant/50 my-0.5" />

          {/* PDF & SMS Delivery Secondary Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePDFDownload}
              className="flex items-center justify-center gap-1.5 p-2.5 border border-outline-variant rounded-xl text-primary hover:bg-surface-container transition-colors active:scale-95 text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              <span>PDF Download</span>
            </button>

            <button
              type="button"
              onClick={handleSMSDelivery}
              className="flex items-center justify-center gap-1.5 p-2.5 border border-outline-variant rounded-xl text-primary hover:bg-surface-container transition-colors active:scale-95 text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">sms</span>
              <span>SMS Delivery</span>
            </button>
          </div>
        </motion.section>

        {/* Order Details Summary Card (Ticket Style) */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-on-surface">
              Order Summary
            </h2>
            <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-black tracking-wider rounded">
              PAID
            </span>
          </div>

          <div className="flex flex-col gap-0.5 mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">
              Event
            </span>
            <span className="text-sm font-bold text-on-surface">
              {eventTitle}
            </span>
          </div>

          <div className="flex justify-between text-xs mb-2">
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                Date & Time
              </span>
              <span className="text-on-surface font-medium">
                Fri, Oct 27 • 9:00 PM
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                Tickets
              </span>
              <span className="text-on-surface font-medium">{ticketType}</span>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-outline-variant/60 my-1 pt-2 flex flex-col gap-1 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, "GHS")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fees & Taxes</span>
              <span>{formatCurrency(fees, "GHS")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Processing Fee</span>
              <span>{formatCurrency(processingFee, "GHS")}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/40 mt-1">
            <span className="text-sm font-bold text-on-surface">Total Paid</span>
            <span className="font-[family-name:var(--font-montserrat)] text-base font-black text-primary">
              {formatCurrency(total, "GHS")}
            </span>
          </div>

          <p className="text-[11px] font-mono text-on-surface-variant text-right mt-1.5">
            Order #{orderId}
          </p>
        </motion.section>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant p-4 flex justify-center max-w-[480px] md:max-w-xl mx-auto shadow-lg">
        <Link
          href="/dashboard"
          className="w-full bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-md active:scale-[0.98] text-center flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            confirmation_number
          </span>
          <span>View My Tickets</span>
        </Link>
      </div>
    </div>
  );
}
