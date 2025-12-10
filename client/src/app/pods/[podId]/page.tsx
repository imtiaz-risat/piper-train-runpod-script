"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAPIClient } from "@/lib/api-client";
import type { PodDetails } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  Cpu,
  HardDrive,
  Network,
  Clock,
  DollarSign,
  Server,
  StopCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

export default function PodDetailsPage() {
  const { podId } = useParams();
  const router = useRouter();
  const client = getAPIClient();

  const [pod, setPod] = useState<PodDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;

    const load = async () => {
      try {
        const data = await client.getPodById(podId as string);
        setPod(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pod");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [client, podId]);

  const handleStop = async () => {
    if (!client || !pod) return;
    setActionLoading("stop");
    try {
      await client.stopPod(pod.id);
      // Refresh pod data
      const data = await client.getPodById(pod.id);
      setPod(data);
    } catch (err) {
      console.error("Failed to stop pod:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTerminate = async () => {
    if (!client || !pod) return;
    if (
      !confirm(
        "Are you sure you want to terminate this pod? This action cannot be undone."
      )
    )
      return;
    setActionLoading("terminate");
    try {
      await client.terminatePod(pod.id);
      router.push("/train");
    } catch (err) {
      console.error("Failed to terminate pod:", err);
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar activePage="pod" isAuthenticated={true} />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-slate-500">Loading pod details...</p>
        </div>
      </div>
    );
  }

  if (error || !pod) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar activePage="pod" isAuthenticated={true} />
        <div className="max-w-4xl mx-auto py-10 px-4">
          <Link href="/train">
            <Button variant="outline" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Pod Not Found
            </h2>
            <p className="text-slate-500">
              {error || "The pod could not be loaded or does not exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageName = pod.imageName || pod.image || "Unknown";
  const gpuDisplayName = pod.gpu?.displayName || pod.gpuCount || "N/A";
  const gpuCount = pod.gpu?.count || pod.gpuCount || 1;
  const status = pod.desiredStatus || "UNKNOWN";

  const statusColors: Record<string, string> = {
    RUNNING: "bg-green-100 text-green-700 border-green-200",
    STOPPED: "bg-yellow-100 text-yellow-700 border-yellow-200",
    EXITED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar activePage="pod" isAuthenticated={true} />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {/* Back Button */}
        <Link href="/train">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Card */}
        <Card className="mb-6 overflow-hidden border-slate-200">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white truncate">
                  {pod.name ?? "Unnamed Pod"}
                </h1>
                <p className="text-purple-200 text-sm mt-1 font-mono">
                  {pod.id}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  statusColors[status] ||
                  "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              disabled={actionLoading !== null || status === "STOPPED"}
              className="gap-2"
            >
              {actionLoading === "stop" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <StopCircle className="w-4 h-4" />
              )}
              Stop Pod
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTerminate}
              disabled={actionLoading !== null}
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              {actionLoading === "terminate" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Terminate
            </Button>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Cost</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Per Hour"
                  value={`$${pod.costPerHr?.toFixed(3) ?? "0.00"}`}
                />
                <DetailItem
                  label="Adjusted"
                  value={`$${pod.adjustedCostPerHr?.toFixed(3) ?? "0.00"}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hardware */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Cpu className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Hardware</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="GPU" value={gpuDisplayName} />
                <DetailItem label="GPU Count" value={gpuCount} />
                <DetailItem label="vCPUs" value={pod.vcpuCount ?? "N/A"} />
                <DetailItem label="RAM" value={`${pod.memoryInGb ?? 0} GB`} />
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Storage</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Volume"
                  value={`${pod.volumeInGb ?? 0} GB`}
                />
                <DetailItem
                  label="Container Disk"
                  value={`${pod.containerDiskInGb ?? 0} GB`}
                />
                <DetailItem
                  label="Mount Path"
                  value={pod.volumeMountPath || "/workspace"}
                  className="col-span-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Network */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Network className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Network</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem label="Public IP" value={pod.publicIp || "N/A"} />
                <DetailItem
                  label="Ports"
                  value={pod.ports?.join(", ") || "N/A"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Server className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Container</h3>
              </div>
              <DetailItem label="Image" value={imageName} />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Timeline</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem label="Created" value={pod.createdAt || "N/A"} />
                <DetailItem
                  label="Last Started"
                  value={pod.lastStartedAt || "N/A"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs text-slate-500 mb-0.5">{label}</span>
      <span className="text-sm font-medium text-slate-800 truncate">
        {String(value)}
      </span>
    </div>
  );
}
