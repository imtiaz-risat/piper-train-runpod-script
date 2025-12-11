"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Rocket } from "lucide-react";

export type NavPage = "home" | "docs" | "train" | "pod";

interface NavbarProps {
  activePage?: NavPage;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Navbar({
  activePage = "home",
  isAuthenticated = false,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 md:px-12 bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/system-logo.png"
          alt="FirstTrain Logo"
          width={650}
          height={500}
          className="h-12 w-auto transition-transform group-hover:scale-105"
        />
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          FirstTrain
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Docs Link */}
        <Link
          href="/docs/piper"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activePage === "docs"
              ? "bg-purple-100 text-purple-700 border border-purple-200"
              : "text-slate-600 hover:text-purple-600 hover:bg-purple-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Docs</span>
        </Link>

        {/* Dashboard/Train Link */}
        {activePage === "train" || activePage === "pod" ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </span>
        ) : (
          <Link
            href="/train/piper"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            <Rocket className="w-4 h-4" />
            <span>Get Started</span>
          </Link>
        )}

        {/* Logout Button (only when authenticated) */}
        {isAuthenticated && onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
