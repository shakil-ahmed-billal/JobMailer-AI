"use client";

import { User } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "./auth-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];

  const checkSession = async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        // Cast better-auth user to our User type (adjust mapping if needed)
        setUser(session.user as unknown as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check session", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      if (!user && !isPublicRoute) {
        router.push("/login");
      } else if (user && isPublicRoute) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
