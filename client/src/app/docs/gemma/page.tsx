"use client";

import { Navbar } from "@/components/navbar";
import { MessageSquare } from "lucide-react";
import { ModuleSwitcher } from "@/components/module-switcher";

export default function GemmaDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar activePage="docs" />

      <div className="flex justify-center gap-6 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <main className="flex-1 max-w-4xl">
          <ModuleSwitcher />

          <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg mx-auto mb-8">
              <MessageSquare className="w-10 h-10" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Gemma LLM Documentation
            </h1>

            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm mb-8">
              Coming Soon
            </div>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto mb-10">
              Documentation for Gemma fine-tuning is under construction. We are
              writing comprehensive guides for LLM customization.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
