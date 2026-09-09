"use client";

import React from "react";
import Link from "next/link";

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-tertiary flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-tertiary-container/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex flex-col items-center">
        {/* Glassmorphism Card */}
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-outline-variant/30 p-6 flex flex-col items-center gap-6">
          {/* Logo / Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[32px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                confirmation_number
              </span>
            </div>

            <div className="text-center">
              <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-black text-on-surface tracking-tight">
                VibePass
              </h1>
              <p className="text-sm text-on-surface-variant mt-1 font-medium">
                Secure Your Spot. Live the Experience.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1 bg-primary-container/30 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Official Tickets
            </div>
            <div className="flex items-center gap-1 bg-tertiary-container/30 text-tertiary px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Instant MoMo
            </div>
            <div className="flex items-center gap-1 bg-secondary-container/30 text-secondary px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              Buyer Protection
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-outline-variant/40" />

          {/* Auth Buttons */}
          <div className="w-full flex flex-col gap-3">
            {/* Sign In */}
            <Link
              href="/auth/login"
              className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold text-center shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Sign In
            </Link>

            {/* Create Account */}
            <Link
              href="/auth/signup"
              className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold text-center shadow-sm hover:bg-primary-fixed-dim transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Create Account
            </Link>
          </div>

          {/* Social Login Divider */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* Social Login Buttons */}
          <div className="w-full flex gap-3">
            {/* Google */}
            <button className="flex-1 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>

            {/* Apple */}
            <button className="flex-1 py-2.5 bg-on-surface text-surface rounded-xl text-xs font-bold hover:bg-on-surface/90 transition-all active:scale-95 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        {/* Browse Link (skip auth) */}
        <Link
          href="/?browsing=true"
          className="mt-6 text-on-primary/80 text-sm font-medium hover:text-on-primary transition-colors flex items-center gap-1.5 group"
        >
          <span>Browse events without signing in</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>

        {/* Footer Text */}
        <p className="mt-4 text-on-primary/50 text-[10px] text-center">
          By continuing, you agree to VibePass&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
