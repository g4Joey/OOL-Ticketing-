"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useAuth, UserRole } from "@/lib/auth-context";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { signup } = useAuth();

  const [role, setRole] = useState<"attendee" | "organizer">("attendee");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    const origHtml = document.documentElement.style.backgroundColor;
    const origBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#006b57";
    document.body.style.backgroundColor = "#006b57";
    return () => {
      document.documentElement.style.backgroundColor = origHtml;
      document.body.style.backgroundColor = origBody;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const displayName = role === "organizer" && orgName ? `${fullName} (${orgName})` : fullName;
    const dbRole: UserRole = role === "organizer" ? "organizer" : "attendee";

    const result = await signup(email, password, displayName, phone, dbRole);

    if (!result.success) {
      setErrorMessage(result.error || "Signup failed. Please try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    // Always land on Explore after signup
    router.push(redirectUrl);
  };

  return (
    <div className="bg-background text-on-background min-h-[100dvh] flex flex-col pt-16 pb-12 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="Create Account" />

      <main className="flex-1 flex flex-col justify-center px-4 max-w-[440px] mx-auto w-full py-4">
        {/* Header Visual */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center mx-auto mb-2.5 shadow-lg ring-4 ring-primary-container/20">
            <span className="material-symbols-outlined text-[32px]">
              person_add
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface">
            Join VibePass
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {redirectUrl.includes("checkout")
              ? "Create your free account to complete your ticket purchase."
              : "Get instant mobile tickets, resale access, and organizer tools."}
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-3 p-3 bg-error/10 border border-error/30 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">error</span>
            <p className="text-xs text-error font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="bg-surface-container rounded-xl p-1 grid grid-cols-2 gap-1 mb-4 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setRole("attendee")}
            className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === "attendee"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Ticket Buyer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === "organizer"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>Event Organizer</span>
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setErrorMessage(""); }}
              placeholder="Alex Mercer"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {role === "organizer" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                Event Production / Agency Name *
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. VibePass Live & Entertainment"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
              placeholder="user@example.com"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Phone Number (for SMS Passes & MoMo) *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="024 123 4567"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Create Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-3.5 pr-10 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(""); }}
              placeholder="Re-enter your password"
              required
              minLength={6}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-primary text-on-primary font-[family-name:var(--font-montserrat)] text-sm font-bold py-3.5 rounded-xl shadow-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create {role === "organizer" ? "Organizer" : ""} Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          Already have an account?{" "}
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupContent />
    </Suspense>
  );
}
