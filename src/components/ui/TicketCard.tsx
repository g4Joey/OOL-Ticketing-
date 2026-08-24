"use client";

import React, { useState } from "react";
import { ActiveTicket } from "@/lib/mock-data";
import { QRModal } from "./QRModal";

interface TicketCardProps {
  ticket: ActiveTicket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant overflow-hidden ticket-tear relative flex flex-col mt-2">
        {/* Status Banner */}
        <div className="bg-tertiary text-on-tertiary px-4 py-1.5 flex justify-between items-center z-10">
          <span className="font-bold text-xs uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Verified</span>
          </span>
          {ticket.isTonight && (
            <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded tracking-wider">
              TONIGHT
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface line-clamp-1">
                {ticket.eventTitle}
              </h4>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-primary">calendar_month</span>
                <span>{ticket.date}</span>
              </p>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                <span>{ticket.venue}</span>
              </p>
            </div>
          </div>

          <div className="ticket-dash my-1" />

          {/* Seat details */}
          <div className="flex justify-between items-center pt-1 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Section</span>
              <span className="font-[family-name:var(--font-montserrat)] text-sm font-extrabold text-on-surface">
                {ticket.section}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Row</span>
              <span className="font-[family-name:var(--font-montserrat)] text-sm font-extrabold text-on-surface">
                {ticket.row}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Seat</span>
              <span className="font-[family-name:var(--font-montserrat)] text-sm font-extrabold text-on-surface">
                {ticket.seat}
              </span>
            </div>
          </div>

          {/* Show Code Button */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="mt-2 w-full bg-primary-container text-on-primary-container font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 active:bg-primary active:text-on-primary transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <span>Show Code</span>
          </button>
        </div>
      </div>

      {/* QR Code Scan Modal */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        ticketData={{
          eventTitle: ticket.eventTitle,
          section: ticket.section,
          row: ticket.row,
          seat: ticket.seat,
          date: ticket.date,
          ticketId: ticket.id,
        }}
      />
    </>
  );
};
