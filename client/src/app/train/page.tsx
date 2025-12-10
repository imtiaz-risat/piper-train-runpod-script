"use client";

import { useState } from "react";
import { AuthModal, clearAuthSession } from "@/components/auth-modal";
import { ActivePods } from "@/components/active-pods";
import { JobForm } from "@/components/job-form";
import { initializeAPIClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function TrainPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [apiClient, setApiClient] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAuth = () => {
    const client = initializeAPIClient();
    setApiClient(client);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthenticated(false);
    setApiClient(null);
  };

  const handleJobSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!authenticated) {
    return <AuthModal onSubmit={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/onlylogo.png"
            alt="FirstTrain Logo"
            width={1000}
            height={1000}
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold text-purple-600">FirstTrain</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className="text-purple-600 font-medium hover:text-purple-700 transition hover:underline"
          >
            Docs
          </Link>
          <span className="inline-flex items-center text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
            Training Dashboard
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-rose-600 text-rose-600 hover:bg-rose-50"
          >
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Active Pods List */}
          <section>
            <ActivePods key={refreshTrigger} client={apiClient} />
          </section>

          {/* New Job Form - Below Pods */}
          <section>
            <JobForm client={apiClient} onSuccess={handleJobSuccess} />
          </section>
        </div>
      </main>
    </div>
  );
}
