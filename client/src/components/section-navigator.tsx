"use client";

import { useState, useEffect } from "react";
import { Cpu, Database, Settings, Check, Circle } from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  requiredFields: string[];
}

interface SectionNavigatorProps {
  formData: Record<string, unknown>;
}

const sections: Section[] = [
  {
    id: "gpu-resources",
    title: "GPU & Resources",
    icon: Cpu,
    requiredFields: ["name", "gpuTypeIds"],
  },
  {
    id: "dataset-tokens",
    title: "Dataset & Tokens",
    icon: Database,
    requiredFields: [
      "hfDatasetRepoId",
      "hfDatasetDownloadToken",
      "hfUploadRepoId",
      "hfUploadToken",
      "hfSessionName",
    ],
  },
  {
    id: "training-params",
    title: "Training Parameters",
    icon: Settings,
    requiredFields: ["maxEpochs"],
  },
];

function isSectionComplete(
  section: Section,
  formData: Record<string, unknown>
): boolean {
  return section.requiredFields.every((field) => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.length > 0 && value[0] !== "";
    }
    if (typeof value === "number") {
      return value > 0;
    }
    return Boolean(value);
  });
}

function getSectionProgress(
  section: Section,
  formData: Record<string, unknown>
): number {
  const completed = section.requiredFields.filter((field) => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.length > 0 && value[0] !== "";
    }
    if (typeof value === "number") {
      return value > 0;
    }
    return Boolean(value);
  }).length;
  return Math.round((completed / section.requiredFields.length) * 100);
}

export function SectionNavigator({ formData }: SectionNavigatorProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections
        .map((s) => ({
          id: s.id,
          element: document.getElementById(s.id),
        }))
        .filter((s) => s.element);

      for (const { id, element } of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Form Sections
          </h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isComplete = isSectionComplete(section, formData);
              const isActive = activeSection === section.id;
              const progress = getSectionProgress(section, formData);

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    isActive
                      ? "bg-purple-50 border border-purple-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md ${
                      isComplete
                        ? "bg-green-100"
                        : isActive
                        ? "bg-purple-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isComplete
                          ? "text-green-600"
                          : isActive
                          ? "text-purple-600"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isActive ? "text-purple-700" : "text-slate-700"
                      }`}
                    >
                      {section.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {isComplete ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Complete
                        </span>
                      ) : (
                        <>
                          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {progress}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle
                        className={`w-4 h-4 ${
                          isActive ? "text-purple-400" : "text-slate-300"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Overall Progress */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Overall Progress</span>
              <span>
                {sections.filter((s) => isSectionComplete(s, formData)).length}/
                {sections.length} sections
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                style={{
                  width: `${
                    (sections.filter((s) => isSectionComplete(s, formData))
                      .length /
                      sections.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
