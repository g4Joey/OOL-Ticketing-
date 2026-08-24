"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StepIndicator } from "@/components/ui/StepIndicator";
import {
  PaymentMethodOption,
  PaymentMethodId,
} from "@/components/ui/PaymentMethodOption";
import { events, featuredEvent, formatCurrency } from "@/lib/mock-data";
import { recordSuccessfulOrder } from "@/lib/supabase/db";
import { useAuth } from "@/lib/auth-context";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const eventId = searchParams.get("eventId") || events[0].id;
  const cartParam = searchParams.get("cart");
  const fallbackTierId = searchParams.get("tierId") || "";
  const fallbackQty = parseInt(searchParams.get("qty") || "1", 10);

  const event =
    events.find((e) => e.id === eventId) ||
    (eventId === featuredEvent.id ? featuredEvent : events[0]);

  // Parse multi-tier cart or fallback to single tier
  const initialCart: Record<string, number> = useMemo(() => {
    if (cartParam) {
      try {
        return JSON.parse(decodeURIComponent(cartParam));
      } catch {
        // fallback
      }
    }
    const defaultTier = event.tiers.find((t) => t.id === fallbackTierId) || event.tiers[0];
    return { [defaultTier?.id || "tier-1"]: fallbackQty };
  }, [cartParam, event, fallbackTierId, fallbackQty]);

  const [cartTiers, setCartTiers] = useState<Record<string, number>>(initialCart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [email, setEmail] = useState<string>(user?.email || "alex@vibepass.com");
  const [phoneNumber, setPhoneNumber] = useState<string>("024 123 4567");

  // Card fields state
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>(user?.fullName || "Alex Mercer");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const updateQuantity = (tierId: string, delta: number) => {
    setCartTiers((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      const copy = { ...prev, [tierId]: next };
      if (next === 0 && Object.keys(copy).length > 1) {
        delete copy[tierId];
      }
      return copy;
    });
  };

  // Cart calculations
  const totalCount = Object.values(cartTiers).reduce((sum, q) => sum + q, 0);

  const subtotal = Object.entries(cartTiers).reduce((sum, [tierId, qty]) => {
    const tier = event.tiers.find((t) => t.id === tierId);
    return sum + (tier ? tier.price * qty : 0);
  }, 0);

  const feesAndTaxes = Math.round(subtotal * 0.05 * 100) / 100; // 5% platform fee
  const processingFee = 2.50; // Fixed GHS 2.50 processing fee
  const total = subtotal + feesAndTaxes + processingFee;

  const ticketTypeSummary = Object.entries(cartTiers)
    .filter(([_, q]) => q > 0)
    .map(([tierId, qty]) => {
      const tier = event.tiers.find((t) => t.id === tierId);
      return `${qty}x ${tier?.tierLabel || "Pass"}`;
    })
    .join(", ");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === "card") {
      setProcessingStatus("Verifying 3D Secure / Bank OTP...");
    } else if (paymentMethod === "mtn" || paymentMethod === "telecel") {
      setProcessingStatus("Sending prompt to Mobile Money wallet...");
    } else {
      setProcessingStatus("Generating USSD session...");
    }

    const orderId = `VIBE-${Math.floor(1000 + Math.random() * 9000)}-GH`;

    // Attempt recording to Supabase in parallel
    try {
      await recordSuccessfulOrder({
        reference: orderId,
        eventTitle: event.title,
        eventId: event.id,
        ticketType: ticketTypeSummary,
        ticketCount: totalCount,
        subtotal,
        fees: feesAndTaxes,
        processingFee,
        total,
        currency: "GHS",
        paymentMethod,
        receiptEmail: email,
        phoneNumber,
      });
    } catch (err) {
      console.warn("Order record notice:", err);
    }

    // Seamless Paystack authorization simulation
    setTimeout(() => {
      setProcessingStatus("Payment Confirmed! Generating tickets...");
      setTimeout(() => {
        router.push(
          `/confirmation/${orderId}?eventTitle=${encodeURIComponent(
            event.title
          )}&ticketType=${encodeURIComponent(
            ticketTypeSummary
          )}&subtotal=${subtotal}&fees=${feesAndTaxes}&processingFee=${processingFee}&total=${total}&email=${encodeURIComponent(
            email
          )}`
        );
      }, 700);
    }, 1200);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-36 pt-16 selection:bg-primary-container selection:text-on-primary-container">
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

        {/* Order Summary Card with Multi-Tier Items */}
        <section className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <h2 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-primary">
            Order Summary
          </h2>

          <div className="pt-1">
            <h3 className="text-sm font-bold text-on-surface">
              {event.title}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {event.date} • {event.venue}
            </p>
          </div>

          {/* List of Cart Items */}
          <div className="flex flex-col divide-y divide-outline-variant/30 my-1 pt-1">
            {Object.entries(cartTiers).map(([tierId, qty]) => {
              const tier = event.tiers.find((t) => t.id === tierId) || {
                name: "Pass",
                tierLabel: "General",
                price: 150,
              };
              const itemTotal = tier.price * qty;

              return (
                <div key={tierId} className="py-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">
                      {tier.tierLabel} ({tier.name})
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      {qty} × {formatCurrency(tier.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
                      <button
                        type="button"
                        onClick={() => updateQuantity(tierId, -1)}
                        className="w-5 h-5 bg-surface-container-lowest text-on-surface rounded flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="text-[11px] font-extrabold min-w-[14px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(tierId, 1)}
                        className="w-5 h-5 bg-primary text-on-primary rounded flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-[family-name:var(--font-montserrat)] font-bold text-on-surface min-w-[60px] text-right">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-outline-variant/60 my-1 pt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center">
              <span>Platform Fees & Taxes (5%)</span>
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
            <span className="text-sm font-bold text-on-surface">
              Total ({totalCount} {totalCount === 1 ? "ticket" : "tickets"})
            </span>
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

          {/* EXPANDABLE CARD INPUT FIELDS */}
          {paymentMethod === "card" && (
            <div className="bg-surface-container-lowest rounded-xl p-4 border-2 border-primary/40 shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Card Details (Paystack 3DS)</span>
                </span>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                  USD & GHS Accepted
                </span>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Alex Mercer"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4123 4567 8901 2345"
                    maxLength={19}
                    required
                    className="w-full bg-surface border border-outline-variant rounded-lg pl-3.5 pr-10 py-2 text-sm font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    credit_card
                  </span>
                </div>
              </div>

              {/* Expiry & CVV Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="12/27"
                    maxLength={5}
                    required
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3.5 py-2 text-sm font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    required
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3.5 py-2 text-sm font-mono tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

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
          disabled={isProcessing || totalCount === 0}
          className="w-full bg-primary-container text-on-primary-fixed font-[family-name:var(--font-montserrat)] text-base font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <span className="w-5 h-5 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
              <span>{processingStatus || "Authorizing Payment..."}</span>
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
          Secured by Paystack • 256-Bit SSL Encrypted
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
