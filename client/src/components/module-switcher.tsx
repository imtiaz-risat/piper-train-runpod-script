"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, BrainCircuit, MessageSquare } from "lucide-react";

export function ModuleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const isDocs = pathname.includes("/docs");

  const getCurrentModule = () => {
    // Check for specific modules in the path
    if (pathname.includes("/nemo")) return "nemo";
    if (pathname.includes("/gemma")) return "gemma";
    // Default to piper if no other module is found (or if it's explicitly piper)
    return "piper";
  };

  const handleValueChange = (value: string) => {
    const section = isDocs ? "docs" : "train";
    router.push(`/${section}/${value}`);
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center gap-2 text-slate-500 font-medium">
        <span className="bg-slate-100 p-1.5 rounded-lg">
          {getCurrentModule() === "piper" && <Mic className="w-4 h-4" />}
          {getCurrentModule() === "nemo" && (
            <BrainCircuit className="w-4 h-4" />
          )}
          {getCurrentModule() === "gemma" && (
            <MessageSquare className="w-4 h-4" />
          )}
        </span>
        {isDocs ? "Documentation For:" : "Training Module:"}
      </div>
      <Select value={getCurrentModule()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] bg-white border-slate-200">
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
  );
}
