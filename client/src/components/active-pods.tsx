"use client";

import { useEffect, useState } from "react";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { APIClient } from "@/lib/api-client";
import type { Pod } from "@/lib/types";

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
  }, []);

  const loadPods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.getPods();
      setPods(data);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-xl sm:text-2xl">
            Active Training Pods
          </CardTitle>
          <CardDescription>
            Monitor and manage your running GPU pods
          </CardDescription>
        </div>
        <Button
          onClick={loadPods}
          variant="outline"
          size="sm"
          disabled={loading}
          className="w-full sm:w-auto bg-transparent"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading && pods.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </CardContent>
        </Card>
      ) : pods.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-slate-600">
              No active pods. Create a new training job to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          {pods.map((pod) => (
            <Card
              key={pod.id}
              className="border-slate-200 hover:border-slate-300 hover:shadow-md transition"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate text-slate-900">
                      {pod.name}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {pod.id}
                    </CardDescription>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      pod.status === "RUNNING"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {pod.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">GPU Type</p>
                    <p className="text-slate-900 font-medium truncate">
                      {pod.gpuTypeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Cost/Hour</p>
                    <p className="text-slate-900 font-medium">
                      ${pod.costPerHr.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 text-xs">Uptime</p>
                    <p className="text-slate-900 font-medium">
                      {Math.floor(pod.uptimeInSeconds / 3600)}h{" "}
                      {Math.floor((pod.uptimeInSeconds % 3600) / 60)}m
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTerminate(pod.id)}
                  disabled={terminating.has(pod.id)}
                  className="w-full"
                >
                  {terminating.has(pod.id) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Terminating...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Terminate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
