"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: "attendee" | "admin";
  loyaltyPoints: number;
  status: "member" | "insider" | "vip";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: "attendee" | "admin", name?: string) => void;
  logout: () => void;
  signup: (email: string, fullName: string, role?: "attendee" | "admin") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check localStorage for saved session
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vibepass_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          // invalid json
        }
      }
    }
  }, []);

  const login = (email: string, role: "attendee" | "admin" = "attendee", name?: string) => {
    const isAlex = email.includes("alex");
    const isAdminUser = role === "admin" || email.includes("admin");

    const newUser: AuthUser = {
      id: isAdminUser ? "admin-001" : "user-001",
      fullName: name || (isAdminUser ? "Admin Joey" : isAlex ? "Alex Mercer" : email.split("@")[0]),
      email,
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEdsNPxJ_IEXGM_Gz1qnunI9Fer_IjbVZ-ybhSyF2ZBF-JcsHtqcgThyhpxRhpm5JVs1W8naMVAg4RiKaXnBZmJi2k3iq7_l9guafvaAqE0gQhnp-ts74APGtprOLZWo1HXITinrqRLj6Dg1iOi0LC8FwVxSENKcOoHkGeDEsljKQv5-OwMAgeZqvcg6Rq9aAIuCfZmcvB0BhHPODiJ79YZeneAPYM1ABeyarAQQje28xsHozJV_tu_Q",
      role: isAdminUser ? "admin" : "attendee",
      loyaltyPoints: 2450,
      status: "insider",
    };

    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("vibepass_user", JSON.stringify(newUser));
    }
  };

  const signup = (email: string, fullName: string, role: "attendee" | "admin" = "attendee") => {
    login(email, role, fullName);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vibepass_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
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
