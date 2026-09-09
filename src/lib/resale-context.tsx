"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ResaleListing {
  id: string;
  ticketId: string;
  sellerEmail: string;
  sellerName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  tierLabel: string;
  originalPrice: number;
  askingPrice: number;
  currency: string;
  status: "pending" | "approved" | "declined" | "sold";
  adminNotes?: string;
  listedAt: string;
  updatedAt: string;
}

interface ResaleContextType {
  listings: ResaleListing[];
  listForResale: (listing: Omit<ResaleListing, "id" | "status" | "listedAt" | "updatedAt">) => void;
  approveResale: (id: string, notes?: string) => void;
  declineResale: (id: string, notes?: string) => void;
  markAsSold: (id: string) => void;
  cancelListing: (id: string) => void;
  getMyListings: (email: string) => ResaleListing[];
  getPendingListings: () => ResaleListing[];
  getApprovedListings: () => ResaleListing[];
}

const STORAGE_KEY = "vibepass_resale_listings";

const ResaleContext = createContext<ResaleContextType>({
  listings: [],
  listForResale: () => {},
  approveResale: () => {},
  declineResale: () => {},
  markAsSold: () => {},
  cancelListing: () => {},
  getMyListings: () => [],
  getPendingListings: () => [],
  getApprovedListings: () => [],
});

function generateId(): string {
  return `resale-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export const ResaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<ResaleListing[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setListings(JSON.parse(saved));
        } catch {
          // invalid json, reset
        }
      }
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined" && listings.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    }
  }, [listings]);

  const listForResale = useCallback(
    (listing: Omit<ResaleListing, "id" | "status" | "listedAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newListing: ResaleListing = {
        ...listing,
        id: generateId(),
        status: "pending",
        listedAt: now,
        updatedAt: now,
      };
      setListings((prev) => {
        const updated = [...prev, newListing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const updateStatus = useCallback(
    (id: string, status: ResaleListing["status"], notes?: string) => {
      setListings((prev) => {
        const updated = prev.map((l) =>
          l.id === id
            ? { ...l, status, adminNotes: notes || l.adminNotes, updatedAt: new Date().toISOString() }
            : l
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const approveResale = useCallback((id: string, notes?: string) => updateStatus(id, "approved", notes), [updateStatus]);
  const declineResale = useCallback((id: string, notes?: string) => updateStatus(id, "declined", notes), [updateStatus]);
  const markAsSold = useCallback((id: string) => updateStatus(id, "sold"), [updateStatus]);

  const cancelListing = useCallback(
    (id: string) => {
      setListings((prev) => {
        const updated = prev.filter((l) => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const getMyListings = useCallback((email: string) => listings.filter((l) => l.sellerEmail === email), [listings]);
  const getPendingListings = useCallback(() => listings.filter((l) => l.status === "pending"), [listings]);
  const getApprovedListings = useCallback(() => listings.filter((l) => l.status === "approved"), [listings]);

  return (
    <ResaleContext.Provider
      value={{
        listings,
        listForResale,
        approveResale,
        declineResale,
        markAsSold,
        cancelListing,
        getMyListings,
        getPendingListings,
        getApprovedListings,
      }}
    >
      {children}
    </ResaleContext.Provider>
  );
};

export const useResale = () => useContext(ResaleContext);
