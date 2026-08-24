"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useTwoFactor, setUseTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-12 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="Sign In" />

      <main className="flex-1 flex flex-col justify-center px-4 max-w-[420px] mx-auto w-full py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="material-symbols-outlined text-[28px]">
              confirmation_number
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-on-surface">
            Welcome to VibePass
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Sign in to access your tickets, wallet, and fast checkout.
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-2 p-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container text-xs font-bold text-on-surface transition-all active:scale-95 shadow-sm"
          >
            {/* Google SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-2 p-2.5 bg-black text-white rounded-xl hover:bg-neutral-900 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            {/* Apple SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.53-9.87-11.75-21.34-15.66-34.41-3.91-13.07-5.87-24.93-5.87-35.58 0-14.2 3.65-26.04 10.95-35.53 7.3-9.49 16.59-14.3 27.87-14.42 4.12 0 8.87 1.09 14.25 3.27 5.38 2.18 9.3 3.33 11.76 3.45 2.13-.12 6.07-1.27 11.83-3.45 5.76-2.18 10.42-3.16 13.98-2.94 10.66.54 19.34 4.54 26.04 12.01-9.37 5.66-13.94 13.43-13.71 23.31.23 7.85 3.14 14.51 8.74 19.98 5.6 5.47 12.43 8.52 20.49 9.15-2.07 6.1-4.74 12.27-8.01 18.52zM119.22 31.84c0-5.88 2.05-11.51 6.15-16.89 4.1-5.38 9.3-9.16 15.6-11.35.33 1.09.49 2.29.49 3.6 0 5.88-2.15 11.73-6.45 17.55-4.3 5.82-9.61 9.49-15.93 11.01-.11-1.31-.16-2.39-.16-3.24z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-outline-variant/60" />
          <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            or with email
          </span>
          <div className="flex-1 h-px bg-outline-variant/60" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@vibepass.com"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold uppercase text-on-surface-variant">
                Password
              </label>
              <a href="#" className="text-[11px] text-primary font-bold hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Optional 2FA Checkbox */}
          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useTwoFactor}
                onChange={(e) => setUseTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  shield
                </span>
                <span>Enable 2-Factor Authentication (2FA)</span>
              </span>
            </label>

            {useTwoFactor && (
              <div className="mt-2.5 pt-2 border-t border-outline-variant/30">
                <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                  6-Digit 2FA Code (SMS or Authenticator)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 rounded-xl shadow-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In to VibePass</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </main>
    </div>
  );
}
