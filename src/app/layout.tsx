import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ResaleProvider } from "@/lib/resale-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#006b57",
};

export const metadata: Metadata = {
  title: {
    default: "VibePass — Secure Your Spot (2026)",
    template: "%s | VibePass",
  },
  description:
    "Ghana's premier event ticketing platform. Buy tickets for concerts, sports, arts, and festivals with MTN MoMo, Telecel MoMo, Visa, and more.",
  keywords: [
    "event tickets",
    "Ghana",
    "concerts",
    "MTN MoMo",
    "ticketing",
    "VibePass",
    "2026 events",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "VibePass",
    title: "VibePass — Secure Your Spot",
    description:
      "Ghana's premier event ticketing platform. Buy tickets for concerts, sports, arts, and festivals.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VibePass",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} light`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-[family-name:var(--font-inter)] text-sm leading-[1.4] min-h-full flex flex-col">
        <AuthProvider><ResaleProvider>{children}</ResaleProvider></AuthProvider>
      </body>
    </html>
  );
}
