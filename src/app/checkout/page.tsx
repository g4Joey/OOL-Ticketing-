"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StepIndicator } from "@/components/ui/StepIndicator";
import {
  PaymentMethodOption,
  PaymentMethodId,
} from "@/components/ui/PaymentMethodOption";
import { events, featuredEvent, formatCurrency } from "@/lib/mock-data";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") || events[0].id;
  const tierId = searchParams.get("tierId") || "";
  const quantity = parseInt(searchParams.get("qty") || "1", 10);

  const event =
    events.find((e) => e.id === eventId) ||
    (eventId === featuredEvent.id ? featuredEvent : events[0]);

  const tier =
    event.tiers.find((t) => t.id === tierId) || event.tiers[0] || {
      id: "default-tier",
      name: "VIP Pass",
      tierLabel: "VIP Admission",
      price: 150,
      currency: "GHS",
    };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [email, setEmail] = useState<string>("alex@vibepass.com");
  const [phoneNumber, setPhoneNumber] = useState<string>("024 123 4567");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Pricing calculations
  const subtotal = tier.price * quantity;
  const feesAndTaxes = Math.round(subtotal * 0.05 * 100) / 100; // 5% platform fee
  const processingFee = 2.50; // Fixed GHS 2.50 processing fee as requested
  const total = subtotal + feesAndTaxes + processingFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate fast and secure payment processing
    setTimeout(() => {
      const orderId = `VIBE-${Math.floor(1000 + Math.random() * 9000)}-GH`;
      router.push(
        `/confirmation/${orderId}?eventTitle=${encodeURIComponent(
          event.title
        )}&ticketType=${encodeURIComponent(
          `${quantity}x ${tier.tierLabel}`
        )}&subtotal=${subtotal}&fees=${feesAndTaxes}&processingFee=${processingFee}&total=${total}&email=${encodeURIComponent(
          email
        )}`
      );
    }, 1200);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-32 pt-16 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <TopAppBar variant="task" title="Checkout" />

      <main className="flex-grow pt-3 px-4 flex flex-col gap-3 max-w-[480px] mx-auto w-full">
        {/* Step Indicator */}
        <StepIndicator currentStep={2} />

        {/* Trust Banner */}
        <div className="bg-primary text-on-primary rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">
            SECURE 256-BIT ENCRYPTION
          </span>
        </div>

        {/* Order Summary Card */}
        <section className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-primary">
            Order Summary
          </h2>

          <div className="flex justify-between items-start pt-1">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                {event.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {event.date}
              </p>
              <p className="text-[11px] font-semibold text-secondary mt-0.5">
                {quantity}x {tier.tierLabel} ({tier.name})
              </p>
            </div>
            <span className="font-[family-name:var(--font-montserrat)] text-sm font-extrabold text-on-surface">
              {formatCurrency(subtotal, "GHS")}
            </span>
          </div>

          <div className="border-t border-dashed border-outline-variant/60 my-1 pt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center">
              <span>Platform Fees & Taxes</span>
              <span>{formatCurrency(feesAndTaxes, "GHS")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span>Payment Processing Fee</span>
                <span className="text-[10px] bg-surface-container px-1.5 py-0.2 rounded text-on-surface-variant">
                  Standard
                </span>
              </span>
              <span>{formatCurrency(processingFee, "GHS")}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/40 mt-1">
            <span className="text-sm font-bold text-on-surface">Total</span>
            <div className="text-right">
              <span className="font-[family-name:var(--font-montserrat)] text-lg font-black text-primary">
                {formatCurrency(total, "GHS")}
              </span>
              <p className="text-[10px] text-on-surface-variant">
                approx. ${(total / 15.5).toFixed(2)} USD
              </p>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-primary mt-2">
          Payment Method
        </h2>

        <div className="flex flex-col gap-2.5">
          {/* Card Option (Visa / Mastercard / Virtual Dollar Cards) */}
          <PaymentMethodOption
            id="card"
            name="Bank Card / Virtual Card"
            subtitle="Visa, Mastercard, USD & GHS Cards"
            badgeContent={
              <div className="w-10 h-7 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  credit_card
                </span>
              </div>
            }
            isSelected={paymentMethod === "card"}
            onSelect={setPaymentMethod}
          />

          {/* MTN MoMo */}
          <PaymentMethodOption
            id="mtn"
            name="MTN Mobile Money"
            subtitle="Instant prompt to your MoMo wallet"
            badgeContent={
              <div className="w-10 h-7 bg-[#ffcc00] rounded flex items-center justify-center font-black text-[#000] text-[10px] tracking-tight shadow-sm">
                MTN
              </div>
            }
            isSelected={paymentMethod === "mtn"}
            onSelect={setPaymentMethod}
          />

          {/* Telecel MoMo */}
          <PaymentMethodOption
            id="telecel"
            name="Telecel Cash"
            subtitle="Telecel MoMo authorization"
            badgeContent={
              <div className="w-10 h-7 bg-[#e2000f] rounded flex items-center justify-center font-black text-[#fff] text-[11px] shadow-sm">
                T
              </div>
            }
            isSelected={paymentMethod === "telecel"}
            onSelect={setPaymentMethod}
          />

          {/* USSD */}
          <PaymentMethodOption
            id="ussd"
            name="USSD (*713#)"
            subtitle="Offline & feature phone instant pay"
            badgeContent={
              <div className="w-10 h-7 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">
                  dialpad
                </span>
              </div>
            }
            isSelected={paymentMethod === "ussd"}
            onSelect={setPaymentMethod}
          />
        </div>

        {/* Dynamic Contextual Inputs */}
        <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant flex flex-col gap-3 mt-1">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant mb-1"
            >
              RECEIPT EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full bg-surface rounded-lg px-3.5 py-2.5 text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Phone Number for MoMo / SMS */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant mb-1"
            >
              {paymentMethod === "mtn" || paymentMethod === "telecel"
                ? "MOBILE MONEY NUMBER"
                : "PHONE NUMBER (FOR SMS TICKET)"}
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="024 123 4567"
              required
              className="w-full bg-surface rounded-lg px-3.5 py-2.5 text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>
      </main>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant p-4 flex flex-col items-center justify-center max-w-[480px] mx-auto shadow-lg">
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-primary-container text-on-primary-fixed font-[family-name:var(--font-montserrat)] text-base font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <span className="w-5 h-5 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
              <span>Authorizing Payment...</span>
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock
              </span>
              <span>Pay {formatCurrency(total, "GHS")} Now</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-on-surface-variant mt-2">
          By paying, you agree to VibePass Terms of Service.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
