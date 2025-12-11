"use client";

import { Navbar } from "@/components/navbar";
import { BrainCircuit } from "lucide-react";
import { ModuleSwitcher } from "@/components/module-switcher";

export default function NeMoPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar activePage="train" />

      <div className="flex justify-center gap-6 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <main className="flex-1 max-w-4xl">
          <ModuleSwitcher />

          <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg mx-auto mb-8">
              <BrainCircuit className="w-10 h-10" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              NeMo STT Training
            </h1>

            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm mb-8">
              Coming Soon
            </div>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto mb-10">
              We're working hard to bring NVIDIA NeMo Speech-to-Text training to
              FirstTrain. You'll soon be able to fine-tune state-of-the-art ASR
              models with your own data.
            </p>

            <div className="p-6 bg-slate-50 rounded-2xl max-w-md mx-auto">
              <h3 className="font-semibold text-slate-900 mb-2">
                Planned Features
              </h3>
              <ul className="text-slate-600 text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Support for FastConformer and Conformer models
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Automatic dataset preprocessing and validation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  WER evaluation and metrics visualization
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
