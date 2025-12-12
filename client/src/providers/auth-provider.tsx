"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthModal } from "@/components/auth-modal";
import { initializeAPIClient } from "@/lib/api-client";
import { Navbar } from "@/components/navbar";

const SESSION_KEY = "auth_session";
// 6 hours in milliseconds
const SESSION_DURATION_MS = 6 * 60 * 60 * 1000;

interface AuthSession {
  username: string;
  expiresAt: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  apiClient: any;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [apiClient, setApiClient] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing valid session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const session: AuthSession = JSON.parse(storedSession);
        if (session.expiresAt > Date.now()) {
          // Session is still valid
          finishLogin(session.username);
        } else {
          // Session expired
          localStorage.removeItem(SESSION_KEY);
          setCheckingSession(false);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setCheckingSession(false);
      }
    } else {
      setCheckingSession(false);
    }
  }, []);

  const finishLogin = (user: string) => {
    const client = initializeAPIClient();
    setApiClient(client);
    setUsername(user);
    setIsAuthenticated(true);
    setCheckingSession(false);
  };

  const login = (user: string) => {
    // Store session
    const session: AuthSession = {
      username: user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    finishLogin(user);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setUsername(null);
    setApiClient(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar activePage="train" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-200"></div>
            <div className="h-4 w-32 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal onLoginSuccess={login} />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, apiClient, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
