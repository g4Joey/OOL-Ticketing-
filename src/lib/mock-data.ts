// Mock data matching Stitch screen content updated for 2026
// Currency: GHS (₵)

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  venueAddress: string;
  city: string;
  date: string;
  doorsOpen: string;
  category: 'music' | 'sports' | 'arts' | 'festivals' | 'comedy';
  imageUrl: string;
  isSellingFast: boolean;
  isVerifiedSeller: boolean;
  isExternalListing?: boolean;
  organizerName?: string;
  tiers: TicketTier[];
}

export interface TicketTier {
  id: string;
  name: string;
  tierLabel: string;
  description: string;
  price: number;
  currency: string;
  available: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  loyaltyPoints: number;
  status: 'member' | 'insider' | 'vip';
}

export interface ActiveTicket {
  id: string;
  eventTitle: string;
  date: string;
  venue: string;
  section: string;
  row: string;
  seat: string;
  tierLabel: string;
  isVerified: boolean;
  isTonight: boolean;
}

export interface Order {
  id: string;
  reference: string;
  eventTitle: string;
  date: string;
  ticketType: string;
  ticketCount: number;
  subtotal: number;
  fees: number;
  processingFee: number;
  total: number;
  currency: string;
  status: 'paid' | 'pending' | 'cancelled';
}

// ─── Events (All set to 2026) ──────────────────────────────────────────────────

export const events: Event[] = [
  {
    id: 'neon-nights-2026',
    title: 'Neon Nights Festival 2026',
    description: 'Experience the electrifying soundscape of the Neon Nights Festival. Join us for a night of immersive visuals, thumping bass, and unforgettable memories as we take over Downtown Arena. Expect special guest appearances and a state-of-the-art light show.',
    venue: 'Downtown Arena',
    venueAddress: '12 Independence Ave, Accra',
    city: 'Accra',
    date: 'Fri, Oct 24, 2026 • 8:00 PM',
    doorsOpen: '6:30 PM',
    category: 'music',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLEOpLAUDmn7d6JmXVyv-Dg1H5CdocS9OuT4k7q7OAxKoA3nmjPQe7ekeCm8IoY_roaEjudpICmYMNxDNiln626__Zjij3MXu2X7jjKF4y9JzmJNauWyi6VyU_2e_PNV94nxJsD0nVUVp3uC2UzwmIUA1KcAx3MYaUU3kRveRA6N3nbHQcFxhlFuv4ul5YHdmAcFN9kEeskXNLYSNrW6yVOSrCUGMWzkcfsXQOkLXfoEmEm9H6_MNi_Q',
    isSellingFast: false,
    isVerifiedSeller: true,
    tiers: [
      {
        id: 'neon-vip',
        name: 'Front Row Access',
        tierLabel: 'VIP Pass',
        description: 'Includes early entry, exclusive merch bundle, and access to the VIP lounge.',
        price: 850,
        currency: 'GHS',
        available: 12,
      },
      {
        id: 'neon-ga',
        name: 'General Admission',
        tierLabel: 'General',
        description: 'Standard entry to the festival grounds with access to all stages.',
        price: 150,
        currency: 'GHS',
        available: 145,
      },
    ],
  },
  {
    id: 'city-vipers-metro-stars',
    title: 'City Vipers vs. Metro Stars 2026',
    description: 'The rivalry continues! Watch the City Vipers take on the Metro Stars in this high-stakes championship showdown at Grand Stadium.',
    venue: 'Grand Stadium',
    venueAddress: 'Accra Sports Complex',
    city: 'Accra',
    date: 'Sat, Nov 02, 2026 • 7:00 PM',
    doorsOpen: '5:30 PM',
    category: 'sports',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlDtpC2aki20xzBcTY81dwuMqcf55ehrSqBwwVKSY690g0EDWA7ro47MBzlAVK6jQtuupwAdQR1HVaYb3tQAfyHF5Og8c39LFxEm66OtCrVxqhWqhkoQVVEXtK1tWwmhLVSxi8bbaNnbDNkpIgP-sR-D-BL3hrdoI6K6w_U_c1qJHBOHTfARHj7WsyUgXtpxy-FrH9B_6Q-jNXvoSOaxkMukwrP2l1UENJUxiWKooe8tEr1bNj8vK9Kw',
    isSellingFast: true,
    isVerifiedSeller: true,
    tiers: [
      {
        id: 'vipers-vip',
        name: 'VIP Box',
        tierLabel: 'VIP',
        description: 'Premium box seating with complimentary refreshments.',
        price: 500,
        currency: 'GHS',
        available: 4,
      },
      {
        id: 'vipers-ga',
        name: 'Standard Seat',
        tierLabel: 'General',
        description: 'Standard stadium seating.',
        price: 80,
        currency: 'GHS',
        available: 88,
      },
    ],
  },
  {
    id: 'glass-menagerie',
    title: 'The Glass Menagerie Revival 2026',
    description: 'A breathtaking modern revival of Tennessee Williams\' classic. Featuring an award-winning cast in an intimate theatre setting.',
    venue: 'Civic Playhouse',
    venueAddress: 'Ring Road, Accra',
    city: 'Accra',
    date: 'Sun, Dec 15, 2026 • 7:30 PM',
    doorsOpen: '7:00 PM',
    category: 'arts',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADo6vT-pUdDQ8jGcKsYvhDuYAOnMEdc33zxRhm8sMQVqS1g55nszkPDv9ceucB7bZCLcEQxLxBH76N_7ZnG9tB90djtBltF6yk8podgy8pnQAuBn9CGZO5BG2a059n1n_hbDMyLM4JuYa1r-7Y9_yEIVDbhDcAku13_Tn01ZcpVLK62FpSkg2nz33L_3I-Xhwk4SadqAjbPS0FWTDFwm3Lwa8rgd51lGIFg5gd0VchbEEB7-P-vFJzCg',
    isSellingFast: false,
    isVerifiedSeller: true,
    tiers: [
      {
        id: 'glass-premium',
        name: 'Premium Orchestra',
        tierLabel: 'Premium',
        description: 'Front orchestra seating with post-show meet & greet.',
        price: 600,
        currency: 'GHS',
        available: 8,
      },
      {
        id: 'glass-standard',
        name: 'Standard Seat',
        tierLabel: 'Standard',
        description: 'Balcony and rear orchestra seating.',
        price: 200,
        currency: 'GHS',
        available: 42,
      },
    ],
  },
  {
    id: 'laugh-out-loud-gala',
    title: 'Laugh Out Loud Gala 2026',
    description: 'An evening of non-stop laughter featuring Ghana\'s top comedians and special international guests. Food and drinks available.',
    venue: 'The Comedy Cellar',
    venueAddress: 'Osu, Accra',
    city: 'Accra',
    date: 'Mon, Oct 28, 2026 • 8:00 PM',
    doorsOpen: '7:30 PM',
    category: 'comedy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkHjCvuJPkO5zROBj54Kdi_AUgKQrrIWJ4Th6RaUTYLqd7YdaUOj9bCY6HsPFr1Bq-6yG1i8_TdbX8Y2_uICbgDy9SXsZTQcAb_pK6EBLW-P8Qs24gSYK08okIlpx_JSWq8UoOUPH6bYuZ-RW4pD0-SzxhIfl4xNU9l7pxk9EAiePuQQDNCEW7LgPGQUfEAujHuw4Zllhr_QFdMIhlIBMIVmLNPwpfrp4ZSFv4bMMH1q8tK6FNH6M5AA',
    isSellingFast: false,
    isVerifiedSeller: true,
    tiers: [
      {
        id: 'laugh-vip',
        name: 'Front Row Table',
        tierLabel: 'VIP',
        description: 'Table for 2 with bottle service in the front row.',
        price: 400,
        currency: 'GHS',
        available: 3,
      },
      {
        id: 'laugh-ga',
        name: 'General Entry',
        tierLabel: 'General',
        description: 'Standard seating in the comedy hall.',
        price: 60,
        currency: 'GHS',
        available: 65,
      },
    ],
  },
];

// Detailed event for Event Details page
export const featuredEvent: Event = {
  id: 'midnight-city-tour-2026',
  title: 'Midnight City Tour 2026',
  description: 'Experience the electrifying soundscape of the Midnight City Tour. Join us for a night of immersive visuals, thumping bass, and unforgettable memories as we take over the Grand Arena. Expect special guest appearances and a state-of-the-art light show.',
  venue: 'Grand Arena',
  venueAddress: 'Neon District, Accra',
  city: 'Accra',
  date: 'Fri, Oct 24, 2026 • 8:00 PM',
  doorsOpen: '6:30 PM',
  category: 'music',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUPa1E539IiRzx3CqhKDq8E0evFc-yVJXafKiYRjOvuktn3irgUVif1fD_LEnnYC_ObwQdw8Ia11uxC9nhtqDhD_xkbgohD9X6fmCVsCSmPgoLMlaVYKPSXjQyirBZ-sKkMCXjn3XK9hvwY5GdSbh1z5Ee64c-jn8vc8G5p-RUH1yJOVenXX4mhU-gOtYAf7E20iLtiOIVgcmAkgSV7hvxte7tUDk57Dkkf2411D1Xh-KHgHcEwtDFGQ',
  isSellingFast: true,
  isVerifiedSeller: true,
  tiers: [
    {
      id: 'midnight-vip',
      name: 'Front Row Access',
      tierLabel: 'VIP Pass',
      description: 'Includes early entry, exclusive merch bundle, and access to the VIP lounge.',
      price: 749,
      currency: 'GHS',
      available: 9,
    },
    {
      id: 'midnight-ga',
      name: 'Standard Entry',
      tierLabel: 'General',
      description: 'Standard standing room access to the main arena floor.',
      price: 375,
      currency: 'GHS',
      available: 120,
    },
  ],
};

// ─── User ────────────────────────────────────────────────────────────────────

export const currentUser: UserProfile = {
  id: 'user-001',
  fullName: 'Alex Mercer',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEdsNPxJ_IEXGM_Gz1qnunI9Fer_IjbVZ-ybhSyF2ZBF-JcsHtqcgThyhpxRhpm5JVs1W8naMVAg4RiKaXnBZmJi2k3iq7_l9guafvaAqE0gQhnp-ts74APGtprOLZWo1HXITinrqRLj6Dg1iOi0LC8FwVxSENKcOoHkGeDEsljKQv5-OwMAgeZqvcg6Rq9aAIuCfZmcvB0BhHPODiJ79YZeneAPYM1ABeyarAQQje28xsHozJV_tu_Q',
  loyaltyPoints: 2450,
  status: 'insider',
};

// ─── Active Tickets ──────────────────────────────────────────────────────────

export const activeTickets: ActiveTicket[] = [
  {
    id: 'ticket-001',
    eventTitle: 'Neon Nights Festival 2026',
    date: 'Fri, Oct 24, 2026 • 8:00 PM',
    venue: 'Downtown Arena',
    section: 'VIP',
    row: 'A',
    seat: '12',
    tierLabel: 'VIP Pass',
    isVerified: true,
    isTonight: true,
  },
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export const sampleOrder: Order = {
  id: 'order-001',
  reference: 'VIBE-8924-GH',
  eventTitle: 'Neon Nights Music Festival 2026',
  date: 'Oct 24, 2026 • 8:00 PM',
  ticketType: '1x VIP Pass, 1x General Admission',
  ticketCount: 2,
  subtotal: 1000,
  fees: 50,
  processingFee: 2.50,
  total: 1052.50,
  currency: 'GHS',
  status: 'paid',
};

// ─── Category labels & icons mapping ─────────────────────────────────────────

export const categoryLabels: Record<string, string> = {
  music: 'Music Festival',
  sports: 'Sports',
  arts: 'Arts & Theatre',
  festivals: 'Cultural Festivals',
  comedy: 'Comedy Shows',
};

export const categoryIcons: Record<string, string> = {
  music: 'festival',
  sports: 'sports_soccer',
  arts: 'theater_comedy',
  festivals: 'celebration',
  comedy: 'attractions',
};

// ─── Date badges for event cards ─────────────────────────────────────────────

export const eventDateBadges: Record<string, { month: string; day: string }> = {
  'neon-nights-2026': { month: 'OCT', day: '24' },
  'city-vipers-metro-stars': { month: 'NOV', day: '02' },
  'glass-menagerie': { month: 'DEC', day: '15' },
  'laugh-out-loud-gala': { month: 'OCT', day: '28' },
  'midnight-city-tour-2026': { month: 'OCT', day: '24' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency: string = 'GHS'): string {
  if (currency === 'GHS') {
    return `₵${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatPrice(amount: number, currency: string = 'GHS'): string {
  if (currency === 'GHS') {
    return `₵${Math.round(amount)}`;
  }
  return `$${Math.round(amount)}`;
}
