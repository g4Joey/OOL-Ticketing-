"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { createAdminEvent } from "@/lib/supabase/db";

interface TierFormItem {
  id: string;
  name: string;
  tierLabel: string;
  description: string;
  price: number;
  quantity: number;
}

export default function CreateEventAdminPage() {
  const router = useRouter();
  const [adminEmail] = useState("admin@vibepass.com");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"music" | "sports" | "arts" | "festivals" | "comedy">("music");
  const [venue, setVenue] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [city, setCity] = useState("Accra");
  const [dateDisplay, setDateDisplay] = useState("Sat, Dec 21, 2024 • 8:00 PM");
  const [doorsOpen, setDoorsOpen] = useState("6:30 PM");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
  );
  const [isSellingFast, setIsSellingFast] = useState(false);

  // Ticket Tiers Builder State
  const [tiers, setTiers] = useState<TierFormItem[]>([
    {
      id: "tier-1",
      name: "Front Row VIP Experience",
      tierLabel: "VIP Pass",
      description: "Includes VIP lounge access, welcome drink, and express entry.",
      price: 650,
      quantity: 50,
    },
    {
      id: "tier-2",
      name: "General Admission",
      tierLabel: "General",
      description: "Standard entry to all event zones.",
      price: 180,
      quantity: 300,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddTier = () => {
    const newTierId = `tier-${tiers.length + 1}`;
    setTiers([
      ...tiers,
      {
        id: newTierId,
        name: "Standard Ticket",
        tierLabel: "Regular",
        description: "Access to standard viewing areas.",
        price: 100,
        quantity: 100,
      },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const handleTierChange = (index: number, field: keyof TierFormItem, value: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const eventSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `event-${Date.now()}`;

    const formattedTiers = tiers.map((t, idx) => ({
      ...t,
      id: `${eventSlug}-${t.tierLabel.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}`,
      price: Number(t.price),
      quantity: Number(t.quantity),
    }));

    const result = await createAdminEvent(adminEmail, {
      id: eventSlug,
      title,
      description,
      venue,
      venueAddress,
      city,
      dateDisplay,
      doorsOpen,
      category,
      imageUrl,
      isSellingFast,
      tiers: formattedTiers,
    });

    if (result.success) {
      router.push("/admin");
    } else {
      setIsSubmitting(false);
      setErrorMsg(result.error || "Failed to create event. Please check inputs.");
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-16 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="Create New Event" />

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-5">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
              <Link href="/admin" className="hover:underline text-primary">
                Admin
              </Link>
              <span>/</span>
              <span>Create Event</span>
            </div>
            <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface">
              Publish New Event
            </h1>
          </div>

          <Link
            href="/admin"
            className="text-xs font-bold text-on-surface-variant hover:text-on-surface p-2 border border-outline-variant rounded-xl"
          >
            Cancel
          </Link>
        </div>

        {errorMsg && (
          <div className="bg-error/10 border border-error text-error text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left 2 Columns: Main Form */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* General Info */}
            <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col gap-3.5">
              <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-primary uppercase tracking-wider">
                1. Event Overview
              </h2>

              <div>
                <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AfroFuture Festival 2024"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary capitalize"
                  >
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts & Theatre</option>
                    <option value="festivals">Festivals</option>
                    <option value="comedy">Comedy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Accra"
                    required
                    className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Black Star Square"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                  Venue Address
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="e.g. High Street, Osu, Accra"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Date & Time Display *
                  </label>
                  <input
                    type="text"
                    value={dateDisplay}
                    onChange={(e) => setDateDisplay(e.target.value)}
                    placeholder="Fri, Oct 24, 2024 • 8:00 PM"
                    required
                    className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Doors Open
                  </label>
                  <input
                    type="text"
                    value={doorsOpen}
                    onChange={(e) => setDoorsOpen(e.target.value)}
                    placeholder="6:30 PM"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                  Event Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the experience, line-up, special guests, age restrictions, and perks..."
                  required
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSellingFast}
                    onChange={(e) => setIsSellingFast(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-error">local_fire_department</span>
                    <span>Flag as &quot;Selling Fast&quot;</span>
                  </span>
                </label>
              </div>
            </section>

            {/* Ticket Tiers Builder */}
            <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2.5">
                <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-primary uppercase tracking-wider">
                  2. Ticket Tiers & Pricing
                </h2>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Tier</span>
                </button>
              </div>

              {tiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50 flex flex-col gap-3 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-secondary">
                      Tier #{index + 1}
                    </span>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(index)}
                        className="text-error hover:bg-error/10 rounded-full p-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                        Tier Label (Badge)
                      </label>
                      <input
                        type="text"
                        value={tier.tierLabel}
                        onChange={(e) => handleTierChange(index, "tierLabel", e.target.value)}
                        placeholder="VIP Pass / General"
                        required
                        className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierChange(index, "name", e.target.value)}
                        placeholder="Front Row Access"
                        required
                        className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                        Price in Cedis (GHS ₵)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={tier.price}
                        onChange={(e) => handleTierChange(index, "price", e.target.value)}
                        required
                        className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                        Total Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={tier.quantity}
                        onChange={(e) => handleTierChange(index, "quantity", e.target.value)}
                        required
                        className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                      Perks & Description
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => handleTierChange(index, "description", e.target.value)}
                      placeholder="Includes early access, welcome cocktail, backstage access..."
                      className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Right Column: Live Card Preview & Publish Actions */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-sm flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider">
                Live Card Preview
              </span>

              {/* Preview Card */}
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
                <div className="relative h-32 bg-surface-dim overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider capitalize">
                    {category}
                  </div>
                  {isSellingFast && (
                    <div className="absolute bottom-2 left-2 bg-error text-on-error px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                      <span>Selling Fast</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold text-on-surface line-clamp-1">
                    {title || "Event Title Preview"}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    📍 {venue || "Venue"}, {city}
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-outline-variant/60 flex justify-between items-center">
                    <span className="text-xs font-black text-primary">
                      From ₵{tiers[0]?.price || 0}
                    </span>
                    <span className="bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full text-[10px] font-bold">
                      Get
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit Logging Notice */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 text-[11px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                  policy
                </span>
                <span>
                  This action will be automatically recorded in the <strong>Admin Audit Logs</strong> under <code>{adminEmail}</code>.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 rounded-xl shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">publish</span>
                    <span>Publish Event Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
