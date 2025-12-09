"use client";

import { useEffect, useState } from "react";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APIClient } from "@/lib/api-client";
import type { Pod } from "@/lib/types";
import Link from "next/link";

interface ActivePodsProps {
  client: APIClient;
}

export function ActivePods({ client }: ActivePodsProps) {
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminating, setTerminating] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPods();
    const interval = setInterval(loadPods, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadPods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.getPods();
      // Filter pods to only show those with 'piper' in their name
      const piperPods = data.filter((pod: Pod) =>
        pod.name?.toLowerCase().includes("piper")
      );
      setPods(piperPods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pods");
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (podId: string) => {
    if (!confirm("Are you sure you want to terminate this pod?")) return;

    try {
      setTerminating((prev) => new Set([...prev, podId]));
      await client.terminatePod(podId);
      setPods((prev) => prev.filter((p) => p.id !== podId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to terminate pod");
    } finally {
      setTerminating((prev) => {
        const next = new Set(prev);
        next.delete(podId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">RunPods</h2>
          <p className="text-sm text-slate-500">Live view of your pods</p>
        </div>
        <Button
          onClick={loadPods}
          variant="outline"
          size="sm"
          disabled={loading}
          className="w-full sm:w-auto bg-transparent"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Loading / Empty */}
      {loading && pods.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : pods.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-slate-600 text-sm">
          No pods. Create a new training job to get started.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {pods.map((pod) => (
            <div
              key={pod.id}
              className="border border-slate-200 rounded-lg hover:shadow-md transition overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {pod.name ?? "Unnamed Pod"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{pod.id}</p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    pod.status === "RUNNING"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {pod.status}
                </div>
              </div>

              <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-500">GPU</p>
                  <p className="font-medium">
                    {pod.gpuDisplayName} × {pod.gpuCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Cost / Hour</p>
                  <p className="font-medium">${pod.costPerHr.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Uptime</p>
                  <p className="font-medium">
                    {Math.floor(pod.uptimeInSeconds / 3600)}h{" "}
                    {Math.floor((pod.uptimeInSeconds % 3600) / 60)}m
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">RAM</p>
                  <p className="font-medium">{pod.memoryInGb} GB</p>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 gap-2">
                <Link
                  href={`/pods/${pod.id}`}
                  className="text-sm px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition"
                >
                  Details
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTerminate(pod.id)}
                  disabled={terminating.has(pod.id)}
                  className="flex items-center gap-1 text-sm px-3 py-1"
                >
                  {terminating.has(pod.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Terminate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
