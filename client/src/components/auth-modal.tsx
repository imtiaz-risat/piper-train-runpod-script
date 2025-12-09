"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SESSION_KEY = "piper_auth_session";
const SESSION_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

interface AuthSession {
  username: string;
  expiresAt: number;
}

interface AuthModalProps {
  onSubmit: (username: string) => void;
}

export function AuthModal({ onSubmit }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing valid session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const session: AuthSession = JSON.parse(storedSession);
        if (session.expiresAt > Date.now()) {
          // Session is still valid
          onSubmit(session.username);
          return;
        } else {
          // Session expired, remove it
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setCheckingSession(false);
  }, [onSubmit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === "SUPIPER" && password === "super-piper") {
      // Store session in localStorage for 6 hours
      const session: AuthSession = {
        username,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      onSubmit(username);
    } else {
      alert("Invalid credentials");
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-slate-50 p-4">
        <div className="text-slate-500">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-purple-600 to-purple-700">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-2xl">Piper Training</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Login to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to clear session (useful for logout)
export function clearAuthSession() {
  localStorage.removeItem(SESSION_KEY);
}
