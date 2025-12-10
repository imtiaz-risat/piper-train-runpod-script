"use client";

import { useState } from "react";
import { AuthModal, clearAuthSession } from "@/components/auth-modal";
import { ActivePods } from "@/components/active-pods";
import { JobForm } from "@/components/job-form";
import { SectionNavigator } from "@/components/section-navigator";
import { initializeAPIClient } from "@/lib/api-client";
import { Navbar } from "@/components/navbar";
import { DEFAULT_JOB_CONFIG } from "@/lib/constants";
import type { JobConfig } from "@/lib/types";

export default function TrainPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [apiClient, setApiClient] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState<JobConfig>({
    ...DEFAULT_JOB_CONFIG,
  });

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
    setFormData({ ...DEFAULT_JOB_CONFIG });
  };

  if (!authenticated) {
    return <AuthModal onSubmit={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans">
      {/* Navigation */}
      <Navbar
        activePage="train"
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      <div className="flex justify-center gap-6 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Main Content */}
        <main className="flex-1 max-w-5xl space-y-8">
          {/* Active Pods List */}
          <section>
            <ActivePods key={refreshTrigger} client={apiClient} />
          </section>

          {/* New Job Form - Below Pods */}
          <section>
            <JobForm
              client={apiClient}
              onSuccess={handleJobSuccess}
              formData={formData}
              onFormDataChange={setFormData}
            />
          </section>
        </main>

        {/* Section Navigator - Right Side */}
        <SectionNavigator
          formData={formData as unknown as Record<string, unknown>}
        />
      </div>
    </div>
  );
}
