"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Settings,
  Database,
  Upload,
  BookOpen,
  Rocket,
  ChevronRight,
  Mic,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/piper", icon: BookOpen },
      { title: "Quick Start", href: "/docs/piper/quickstart", icon: Rocket },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Environment Variables",
        href: "/docs/piper/environment-variables",
        icon: Settings,
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        title: "Dataset Preparation",
        href: "/docs/piper/dataset-preparation",
        icon: Database,
      },
      {
        title: "Upload to Hugging Face",
        href: "/docs/piper/huggingface-upload",
        icon: Upload,
      },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentModule = () => {
    if (pathname.includes("/docs/piper")) return "piper";
    if (pathname.includes("/docs/nemo")) return "nemo";
    if (pathname.includes("/docs/gemma")) return "gemma";
    return "piper";
  };

  const currentModule = getCurrentModule();

  const handleModuleChange = (value: string) => {
    router.push(`/docs/${value}`);
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4">
        <div className="mb-6 px-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
            Documentation For
          </label>
          <Select value={currentModule} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-full bg-white border-slate-200">
              <SelectValue placeholder="Select Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piper">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-500" />
                  <span>Piper TTS</span>
                </div>
              </SelectItem>
              <SelectItem value="nemo">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-500" />
                  <span>NeMo STT</span>
                </div>
              </SelectItem>
              <SelectItem value="gemma">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span>Gemma LLM</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentModule === "piper" ? (
          <nav className="space-y-6">
            {navigation.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                  {group.title}
                </h4>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.title}</span>
                          {isActive && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        ) : (
          <div className="px-3 py-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-500 text-center">
            Documentation coming soon for{" "}
            {currentModule === "nemo" ? "NeMo STT" : "Gemma LLM"}
          </div>
        )}
      </div>
    </aside>
  );
}

// Mobile sidebar toggle component
export function MobileSidebarToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg"
    >
      <BookOpen className="w-5 h-5" />
    </button>
  );
}
