import React from "react";
import Link from "next/link";
import { Event, eventDateBadges, formatPrice } from "@/lib/mock-data";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const lowestPrice = Math.min(...event.tiers.map((t) => t.price));
  const dateBadge = eventDateBadges[event.id] || { month: "OCT", day: "24" };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md active:scale-[0.98] group">
      {/* Image & Badges */}
      <Link href={`/events/${event.id}`} className="relative h-32 md:h-44 bg-surface-dim block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Date Badge */}
        <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-md px-2 py-1 rounded font-bold text-on-surface shadow-sm flex flex-col items-center leading-none text-center">
          <span className="text-error text-[10px] font-extrabold tracking-wider uppercase">{dateBadge.month}</span>
          <span className="text-[13px] font-black">{dateBadge.day}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider shadow-sm capitalize">
          {event.category}
        </div>

        {/* Selling Fast Badge */}
        {event.isSellingFast && (
          <div className="absolute bottom-2 left-2 bg-error text-on-error px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
            <span>Selling Fast</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/events/${event.id}`}>
          <h4 className="text-sm font-bold text-on-surface mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h4>
        </Link>
        <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mb-3">
          <span className="material-symbols-outlined text-[12px] text-primary">location_on</span>
          <span className="truncate">{event.venue}</span>
        </p>

        {/* Ticket Tear Border */}
        <div className="mt-auto pt-2 ticket-border ticket-tear" />

        {/* Footer Pricing & CTA */}
        <div className="pt-2 flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-on-surface-variant">From</span>
            <span className="font-[family-name:var(--font-montserrat)] text-lg text-primary font-bold tracking-tight">
              {formatPrice(lowestPrice, "GHS")}
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm active:scale-95 text-center inline-block"
          >
            Get
          </Link>
        </div>
      </div>
    </div>
  );
};
