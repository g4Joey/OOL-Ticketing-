"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Set green background on html/body to prevent white overscroll
    const origHtml = document.documentElement.style.backgroundColor;
    const origBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#006b57";
    document.body.style.backgroundColor = "#006b57";

    // Auto-fill email if previously saved
    if (typeof window !== "undefined") {
      const recentEmail = localStorage.getItem("vibepass_recent_email");
      if (recentEmail) {
        setEmail(recentEmail);
      }
    }

    return () => {
      document.documentElement.style.backgroundColor = origHtml;
      document.body.style.backgroundColor = origBody;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = await login(email, password);

    if (!result.success) {
      setErrorMessage(result.error || "Login failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Remember email for next visit
    if (typeof window !== "undefined") {
      localStorage.setItem("vibepass_recent_email", email);
    }

    setIsLoading(false);
    // Always land on Explore or the redirect URL (never admin portal directly)
    router.push(redirectUrl);
  };

  return (
    <div className="bg-background text-on-background min-h-[100dvh] w-full flex-1 flex flex-col pt-16 pb-12 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="Sign In" />

      <main className="flex-1 flex flex-col justify-center px-4 max-w-[440px] mx-auto w-full py-4">
        {/* Header Visual */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-primary-container/20">
            <span className="material-symbols-outlined text-[32px]">
              confirmation_number
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface">
            Welcome to VibePass
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Sign in to access your tickets, express checkout, or organizer dashboard.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">error</span>
            <p className="text-xs text-error font-semibold">{errorMessage}</p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-outline-variant/60" />
          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
            sign in with email
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
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
              placeholder="user@example.com"
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                placeholder="Enter your password"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 rounded-xl shadow-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-outline-variant/30 text-center">
          <p className="text-xs text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-primary font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginContent />
    </Suspense>
  );
}
