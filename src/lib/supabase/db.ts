import { supabase } from "./client";
import { events as mockEvents, featuredEvent, Event, TicketTier, ActiveTicket } from "../mock-data";

export interface AdminAuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export async function fetchAllEvents(): Promise<Event[]> {
  try {
    const { data: dbEvents, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (eventsError || !dbEvents || dbEvents.length === 0) {
      return mockEvents;
    }

    const { data: dbTiers } = await supabase.from("ticket_tiers").select("*");

    return dbEvents.map((e) => {
      const eventTiers: TicketTier[] = (dbTiers || [])
        .filter((t) => t.event_id === e.id)
        .map((t) => ({
          id: t.id,
          name: t.name,
          tierLabel: t.tier_label,
          description: t.description,
          price: Number(t.price),
          currency: t.currency || "GHS",
          available: t.quantity - t.sold,
        }));

      return {
        id: e.id,
        title: e.title,
        description: e.description,
        venue: e.venue,
        venueAddress: e.venue_address || "",
        city: e.city || "Accra",
        date: e.date_display,
        doorsOpen: e.doors_open || "6:30 PM",
        category: e.category,
        imageUrl: e.image_url,
        isSellingFast: e.is_selling_fast,
        isVerifiedSeller: e.is_verified_seller,
        tiers: eventTiers.length > 0 ? eventTiers : mockEvents.find((m) => m.id === e.id)?.tiers || [],
      };
    });
  } catch {
    return mockEvents;
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const { data: e, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !e) {
      return mockEvents.find((m) => m.id === id) || (id === featuredEvent.id ? featuredEvent : null);
    }

    const { data: dbTiers } = await supabase
      .from("ticket_tiers")
      .select("*")
      .eq("event_id", id);

    const eventTiers: TicketTier[] = (dbTiers || []).map((t) => ({
      id: t.id,
      name: t.name,
      tierLabel: t.tier_label,
      description: t.description,
      price: Number(t.price),
      currency: t.currency || "GHS",
      available: t.quantity - t.sold,
    }));

    return {
      id: e.id,
      title: e.title,
      description: e.description,
      venue: e.venue,
      venueAddress: e.venue_address || "",
      city: e.city || "Accra",
      date: e.date_display,
      doorsOpen: e.doors_open || "6:30 PM",
      category: e.category,
      imageUrl: e.image_url,
      isSellingFast: e.is_selling_fast,
      isVerifiedSeller: e.is_verified_seller,
      tiers: eventTiers.length > 0 ? eventTiers : mockEvents.find((m) => m.id === id)?.tiers || [],
    };
  } catch {
    return mockEvents.find((m) => m.id === id) || (id === featuredEvent.id ? featuredEvent : null);
  }
}

export async function recordSuccessfulOrder(orderData: {
  reference: string;
  eventTitle: string;
  eventId?: string;
  ticketType: string;
  ticketCount: number;
  subtotal: number;
  fees: number;
  processingFee: number;
  total: number;
  currency: string;
  paymentMethod: string;
  receiptEmail: string;
  phoneNumber?: string;
}): Promise<boolean> {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        reference: orderData.reference,
        event_title: orderData.eventTitle,
        event_id: orderData.eventId,
        ticket_type: orderData.ticketType,
        ticket_count: orderData.ticketCount,
        subtotal: orderData.subtotal,
        fees: orderData.fees,
        processing_fee: orderData.processingFee,
        total: orderData.total,
        currency: orderData.currency,
        payment_method: orderData.paymentMethod,
        receipt_email: orderData.receiptEmail,
        phone_number: orderData.phoneNumber,
        status: "paid",
      })
      .select()
      .single();

    if (error) {
      console.warn("Supabase order insert notice:", error.message);
      return false;
    }

    // Insert active ticket
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}-GH`;
    await supabase.from("tickets").insert({
      id: ticketId,
      order_id: order?.id,
      event_title: orderData.eventTitle,
      tier_label: orderData.ticketType,
      date_display: "Fri, Oct 24, 2026 • 8:00 PM",
      venue: "Grand Arena, Accra",
      section: "VIP",
      row: "A",
      seat: String(Math.floor(1 + Math.random() * 50)),
      qr_code_data: JSON.stringify({
        ticketId,
        ref: orderData.reference,
        event: orderData.eventTitle,
        valid: true,
      }),
      is_verified: true,
      is_tonight: true,
      status: "active",
    });

    return true;
  } catch (err) {
    console.warn("Error recording order in Supabase:", err);
    return false;
  }
}

// ─── ADMIN AUDIT LOGS & EVENT CREATION ─────────────────────────────────────────

export async function createAdminEvent(
  adminEmail: string,
  eventData: {
    id: string;
    title: string;
    description: string;
    venue: string;
    venueAddress?: string;
    city: string;
    dateDisplay: string;
    doorsOpen: string;
    category: 'music' | 'sports' | 'arts' | 'festivals' | 'comedy';
    imageUrl: string;
    isSellingFast?: boolean;
    tiers: {
      id: string;
      name: string;
      tierLabel: string;
      description: string;
      price: number;
      quantity: number;
    }[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Insert Event
    const { error: eventError } = await supabase.from("events").insert({
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      venue: eventData.venue,
      venue_address: eventData.venueAddress || "",
      city: eventData.city || "Accra",
      date_display: eventData.dateDisplay,
      doors_open: eventData.doorsOpen,
      category: eventData.category,
      image_url: eventData.imageUrl,
      is_selling_fast: eventData.isSellingFast || false,
      is_verified_seller: true,
      created_by: adminEmail,
      status: "active",
    });

    if (eventError) {
      return { success: false, error: eventError.message };
    }

    // 2. Insert Tiers
    if (eventData.tiers && eventData.tiers.length > 0) {
      const tierRows = eventData.tiers.map((t) => ({
        id: t.id,
        event_id: eventData.id,
        name: t.name,
        tier_label: t.tierLabel,
        description: t.description,
        price: t.price,
        currency: "GHS",
        quantity: t.quantity,
        sold: 0,
      }));

      const { error: tiersError } = await supabase.from("ticket_tiers").insert(tierRows);
      if (tiersError) {
        console.warn("Tiers insert warning:", tiersError.message);
      }
    }

    // 3. Record Audit Log
    await recordAdminLog({
      admin_email: adminEmail,
      action: "CREATE_EVENT",
      target_type: "EVENT",
      target_id: eventData.id,
      details: {
        event_title: eventData.title,
        category: eventData.category,
        venue: eventData.venue,
        tier_count: eventData.tiers.length,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create event" };
  }
}

export async function recordAdminLog(log: {
  admin_email: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
}): Promise<void> {
  try {
    await supabase.from("admin_logs").insert({
      admin_email: log.admin_email,
      action: log.action,
      target_type: log.target_type,
      target_id: log.target_id,
      details: log.details || {},
      ip_address: "127.0.0.1",
    });
  } catch (err) {
    console.warn("Audit logging notice:", err);
  }
}

export async function fetchAdminLogs(): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      return [
        {
          id: "log-1",
          admin_email: "admin@vibepass.com",
          action: "LOGIN",
          target_type: "SESSION",
          target_id: "sess_admin_01",
          details: { method: "Password + 2FA", status: "Success" },
          ip_address: "197.255.99.242",
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: "log-2",
          admin_email: "admin@vibepass.com",
          action: "CREATE_EVENT",
          target_type: "EVENT",
          target_id: "midnight-city-tour",
          details: { event_title: "Midnight City Tour", category: "music" },
          ip_address: "197.255.99.242",
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
      ];
    }

    return data;
  } catch {
    return [];
  }
}
