"use client";

import { useState, useEffect } from "react";
import { ActivePods } from "@/components/active-pods";
import { JobForm } from "@/components/job-form";
import { SectionNavigator } from "@/components/section-navigator";
import { Navbar } from "@/components/navbar";
import { ModuleSwitcher } from "@/components/module-switcher";
import { DEFAULT_JOB_CONFIG } from "@/lib/constants";
import type { JobConfig } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export default function TrainPage() {
  const { logout, apiClient, username } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState<JobConfig>({
    ...DEFAULT_JOB_CONFIG,
  });

  const handleJobSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setFormData({ ...DEFAULT_JOB_CONFIG });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 font-sans">
      {/* Navigation */}
      <Navbar activePage="train" isAuthenticated={true} onLogout={logout} />

      <div className="flex justify-center gap-6 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Main Content */}
        <main className="flex-1 max-w-5xl space-y-8">
          <ModuleSwitcher />

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
              username={username || "anonymous"}
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
