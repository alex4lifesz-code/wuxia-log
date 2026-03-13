"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPersistedUser, persistUser, clearPersistedUser } from "@/lib/storage";

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

  // Hydrate auth state from persistent storage on mount
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const saved = await getPersistedUser();
        if (saved && !cancelled) {
          const parsedUser = JSON.parse(saved);
          setUser(parsedUser);
        }
      } catch {
        // Corrupted data — clear without blocking the finally block
        clearPersistedUser().catch(() => {});
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // Hard timeout: if hydration hasn't completed in 5 s, force-finish
    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        clearPersistedUser().catch(() => {});
        setIsLoading(false);
      }
    }, 5000);

    hydrate().finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const login = useCallback((userData: User, rememberMe = false) => {
    setUser(userData);
    persistUser(JSON.stringify(userData), rememberMe);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await clearPersistedUser();
    localStorage.removeItem("cultivation-nav-state");
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
