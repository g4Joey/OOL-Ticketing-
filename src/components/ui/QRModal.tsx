"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: {
    eventTitle: string;
    section: string;
    row: string;
    seat: string;
    date: string;
    ticketId: string;
    holderName?: string;
  };
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  ticketData,
}) => {
  if (!isOpen) return null;

  const qrValue = JSON.stringify({
    ticketId: ticketData.ticketId,
    event: ticketData.eventTitle,
    seat: `${ticketData.section}-${ticketData.row}-${ticketData.seat}`,
    valid: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-outline-variant/30 flex flex-col items-center relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-4 mt-1">
          <span className="bg-tertiary-container text-on-tertiary-container text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
            Verified Pass
          </span>
          <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-on-surface mt-2 line-clamp-1">
            {ticketData.eventTitle}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">{ticketData.date}</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-xl border border-outline-variant/40 shadow-inner flex flex-col items-center justify-center my-2">
          <QRCodeSVG
            value={qrValue}
            size={190}
            level="H"
            includeMargin={true}
            fgColor="#002019"
          />
          <span className="text-[11px] font-mono font-bold tracking-widest text-on-surface-variant mt-2">
            #{ticketData.ticketId.toUpperCase()}
          </span>
        </div>

        {/* Seat Breakdown */}
        <div className="w-full grid grid-cols-3 gap-2 bg-surface-container-low rounded-xl p-3 my-3 text-center border border-outline-variant/20">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Section</span>
            <p className="text-sm font-black text-on-surface">{ticketData.section}</p>
          </div>
          <div className="border-x border-outline-variant/30">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Row</span>
            <p className="text-sm font-black text-on-surface">{ticketData.row}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Seat</span>
            <p className="text-sm font-black text-on-surface">{ticketData.seat}</p>
          </div>
        </div>

        {/* Gate instruction */}
        <p className="text-[11px] text-on-surface-variant text-center mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">brightness_high</span>
          <span>Set screen brightness to max for scanning at gate.</span>
        </p>

        {/* Done CTA */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-on-primary-fixed-variant transition-colors active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};
