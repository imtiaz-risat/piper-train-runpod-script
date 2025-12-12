"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

interface AuthModalProps {
  onLoginSuccess: (username: string) => void;
}

export function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(username);
      } else {
        alert(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar activePage="train" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          {/* Decorative elements behind card */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <Card className="relative w-full border border-slate-200 shadow-xl bg-white overflow-hidden">
            {/* Top colored accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>

            <CardHeader className="space-y-3 pt-8 pb-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 shadow-inner">
                <Lock className="h-7 w-7 text-purple-600" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-slate-500 text-base">
                  Sign in to access your training dashboard
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  {/* Username Input */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-400 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-400 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 rounded-md hover:bg-slate-100"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading || !username || !password}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 rounded-lg transition-all duration-200 disabled:opacity-70"
                  >
                    <span className="flex items-center gap-2">
                      {loading ? "Verifying..." : "Sign In"}
                      {!loading && (
                        <ArrowRight className="w-4 h-4 opacity-80" />
                      )}
                    </span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
