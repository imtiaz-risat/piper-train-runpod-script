"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  AlertCircle,
  Loader2,
  Activity,
  Server,
  Clock,
  DollarSign,
  Cpu,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "RUNNING":
        return "bg-green-100 text-green-700 border-green-200";
      case "EXITED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Active Training Pods
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your running training sessions
          </p>
        </div>
        <Button
          onClick={loadPods}
          variant="outline"
          size="sm"
          disabled={loading}
          className="bg-white border-slate-200 hover:bg-slate-50 hover:text-purple-600 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Refresh List
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && pods.length === 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-slate-50 border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && pods.length === 0 && (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-white rounded-full border border-slate-100 shadow-sm mb-4">
              <Server className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No Active Pods
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              You don't have any training pods running. Start a new training job
              below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pod List */}
      {!loading && pods.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {pods.map((pod) => (
            <Card
              key={pod.id}
              className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Main Info */}
                <div className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Box className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {pod.name || "Unnamed Pod"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-mono">
                            {pod.id}
                          </code>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              pod.status
                            )} text-[10px] px-2 py-0 h-5 border`}
                          >
                            {pod.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Cpu className="w-4 h-4 text-slate-400" />
                      <span>
                        {pod.gpuCount}x {pod.gpuDisplayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Server className="w-4 h-4 text-slate-400" />
                      <span>{pod.memoryInGb} GB RAM</span>
                    </div>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col justify-between p-4 bg-slate-50/50 lg:w-48 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> Cost/hr
                      </span>
                      <span className="font-medium text-slate-700">
                        ${pod.costPerHr.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Uptime
                      </span>
                      <span className="font-medium text-slate-700">
                        {Math.floor(pod.uptimeInSeconds / 3600)}h{" "}
                        {Math.floor((pod.uptimeInSeconds % 3600) / 60)}m
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 sm:pt-0 lg:pt-3 mt-auto border-t sm:border-t-0 lg:border-t border-slate-200">
                    <Link href={`/pods/${pod.id}`} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 bg-white hover:bg-purple-50 hover:text-purple-700 border-slate-200"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminate(pod.id)}
                      disabled={terminating.has(pod.id)}
                      className="w-full h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {terminating.has(pod.id) ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                      ) : (
                        <Trash2 className="w-3 h-3 mr-1.5" />
                      )}
                      Terminate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
