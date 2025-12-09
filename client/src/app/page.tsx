"use client";

import { useState } from "react";
import { AuthModal, clearAuthSession } from "@/components/auth-modal";
import { ActivePods } from "@/components/active-pods";
import { JobForm } from "@/components/job-form";
import { initializeAPIClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [apiClient, setApiClient] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAuth = (username: string) => {
    const runpod_apiKey = process.env.NEXT_PUBLIC_RUNPOD_API_KEY || "";
    if (!runpod_apiKey) {
      console.warn("NEXT_PUBLIC_RUNPOD_API_KEY is not set!");
    }
    const client = initializeAPIClient(runpod_apiKey);
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
    <div className="min-h-screen bg-linear-to-b from-white to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                RunPod Dashboard
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

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
