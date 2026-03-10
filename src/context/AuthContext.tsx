"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, rememberMe?: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage or sessionStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cultivation-user") || sessionStorage.getItem("cultivation-user");
    if (saved) {
      try {
        const parsedUser = JSON.parse(saved);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("cultivation-user");
        sessionStorage.removeItem("cultivation-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData: User, rememberMe = false) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem("cultivation-user", JSON.stringify(userData));
      sessionStorage.removeItem("cultivation-user");
    } else {
      sessionStorage.setItem("cultivation-user", JSON.stringify(userData));
      localStorage.removeItem("cultivation-user");
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("cultivation-user");
    sessionStorage.removeItem("cultivation-user");
    localStorage.removeItem("cultivation-nav-state");
    localStorage.removeItem("cultivation-theme");
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
