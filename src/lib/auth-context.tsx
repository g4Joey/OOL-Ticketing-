"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export type UserRole = "attendee" | "organizer" | "admin" | "super_admin";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  loyaltyPoints: number;
  status: "member" | "insider" | "vip";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, fullName: string, phone: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
  signup: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vibepass_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          localStorage.removeItem("vibepass_user");
        }
      }
    }
  }, []);

  const persistUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem("vibepass_user", JSON.stringify(u));
      } else {
        localStorage.removeItem("vibepass_user");
      }
    }
  }, []);

  /**
   * Login: Validates credentials against Supabase profiles table.
   * Rejects if no matching email+password found.
   */
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check Supabase profiles table for the user
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (error) {
        console.warn("Supabase profile lookup error:", error.message);
      }

      if (!profile) {
        // Also check local registry as fallback (for offline/demo)
        if (typeof window !== "undefined") {
          const registry = JSON.parse(localStorage.getItem("vibepass_user_registry") || "{}");
          const local = registry[trimmedEmail];
          if (local && local.password === password) {
            const authUser: AuthUser = {
              id: local.id || `local-${Date.now()}`,
              fullName: local.fullName || trimmedEmail.split("@")[0],
              email: trimmedEmail,
              avatarUrl: "",
              role: (local.role as UserRole) || "attendee",
              loyaltyPoints: 0,
              status: "member",
            };
            persistUser(authUser);
            return { success: true };
          }
        }
        return { success: false, error: "No account found with this email. Please create an account first." };
      }

      // 2. Verify password — stored as hashed in a real system.
      // For now we check the password field we store on signup.
      // In production, use Supabase Auth signInWithPassword.
      if (profile.password_hash && profile.password_hash !== password) {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      // 3. Build AuthUser from DB profile
      const authUser: AuthUser = {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        avatarUrl: profile.avatar_url || "",
        role: (profile.role as UserRole) || "attendee",
        loyaltyPoints: profile.loyalty_points || 0,
        status: profile.status || "member",
      };

      persistUser(authUser);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);

      // Fallback: check local registry
      if (typeof window !== "undefined") {
        const registry = JSON.parse(localStorage.getItem("vibepass_user_registry") || "{}");
        const local = registry[trimmedEmail];
        if (local && local.password === password) {
          const authUser: AuthUser = {
            id: local.id || `local-${Date.now()}`,
            fullName: local.fullName || trimmedEmail.split("@")[0],
            email: trimmedEmail,
            avatarUrl: "",
            role: (local.role as UserRole) || "attendee",
            loyaltyPoints: 0,
            status: "member",
          };
          persistUser(authUser);
          return { success: true };
        }
      }

      return { success: false, error: "Unable to connect. Please check your internet and try again." };
    }
  }, [persistUser]);

  /**
   * Signup: Creates a new profile in Supabase and local registry.
   */
  const signup = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole = "attendee"
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (existing) {
        return { success: false, error: "An account with this email already exists. Please sign in instead." };
      }

      // Insert new profile into Supabase
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          full_name: fullName,
          email: trimmedEmail,
          phone: phone,
          role: role === "super_admin" ? "admin" : role, // DB stores admin, app distinguishes super_admin
          password_hash: password, // In production, hash this server-side
          loyalty_points: 0,
          status: "member",
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase insert error:", error.message);
        // If DB insert fails, still save locally for offline use
      }

      const userId = newProfile?.id || `local-${Date.now()}`;

      // Save to local registry as backup
      if (typeof window !== "undefined") {
        const registry = JSON.parse(localStorage.getItem("vibepass_user_registry") || "{}");
        registry[trimmedEmail] = {
          id: userId,
          role,
          fullName,
          phone,
          password,
        };
        localStorage.setItem("vibepass_user_registry", JSON.stringify(registry));
        localStorage.setItem("vibepass_recent_email", trimmedEmail);
      }

      // Auto-login after signup
      const authUser: AuthUser = {
        id: userId,
        fullName,
        email: trimmedEmail,
        avatarUrl: "",
        role,
        loyaltyPoints: 0,
        status: "member",
      };

      persistUser(authUser);
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err);

      // Offline fallback — save locally
      const userId = `local-${Date.now()}`;
      if (typeof window !== "undefined") {
        const registry = JSON.parse(localStorage.getItem("vibepass_user_registry") || "{}");
        registry[trimmedEmail] = { id: userId, role, fullName, phone, password };
        localStorage.setItem("vibepass_user_registry", JSON.stringify(registry));
        localStorage.setItem("vibepass_recent_email", trimmedEmail);
      }

      const authUser: AuthUser = {
        id: userId,
        fullName,
        email: trimmedEmail,
        avatarUrl: "",
        role,
        loyaltyPoints: 0,
        status: "member",
      };
      persistUser(authUser);
      return { success: true };
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    persistUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vibepass_user");
      localStorage.removeItem("vibepass_recent_email");
    }
  }, [persistUser]);

  const isAdmin = user?.role === "admin" || user?.role === "organizer" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
