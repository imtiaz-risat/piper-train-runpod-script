"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAPIClient } from "@/lib/api-client";
import type { PodDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PodDetailsPage() {
  const { podId } = useParams();
  const client = getAPIClient();

  const [pod, setPod] = useState<PodDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error || !pod) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-center py-20 text-red-600">
          {error || "Pod not found or failed to load."}
        </div>
      </div>
    );
  }

  const imageName = pod.imageName || pod.image || "Unknown";
  const gpuDisplayName = pod.gpu?.displayName || pod.gpuCount || "N/A";
  const gpuCount = pod.gpu?.count || pod.gpuCount || 1;
  const status = pod.desiredStatus || "UNKNOWN";

  const sections: Array<{ title: string; items: [string, any][] }> = [
    {
      title: "Basic Info",
      items: [
        ["Pod ID", pod.id],
        ["Cost Per Hour", `$${pod.costPerHr?.toFixed(2) ?? "0.00"}`],
        ["Adjusted Cost", `$${pod.adjustedCostPerHr?.toFixed(2) ?? "0.00"}`],
      ],
    },
    {
      title: "Hardware",
      items: [
        ["GPU", gpuDisplayName],
        ["GPU Count", gpuCount],
        ["vCPUs", pod.vcpuCount],
        ["RAM", `${pod.memoryInGb} GB`],
      ],
    },
    {
      title: "Storage",
      items: [
        ["Volume", `${pod.volumeInGb} GB`],
        ["Container Disk", `${pod.containerDiskInGb} GB`],
        ["Mount Path", pod.volumeMountPath || "/workspace"],
      ],
    },
    {
      title: "Network",
      items: [
        ["Public IP", pod.publicIp || "N/A"],
        ["Ports", pod.ports?.join(", ") || "N/A"],
      ],
    },
    {
      title: "Image",
      items: [["Image Name", imageName]],
    },
    {
      title: "Timeline",
      items: [
        ["Created At", pod.createdAt || "N/A"],
        ["Last Started", pod.lastStartedAt || "N/A"],
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <Link href="/">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-slate-900 truncate">
              {pod.name ?? "Unnamed Pod"}
            </CardTitle>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                status === "RUNNING"
                  ? "bg-green-100 text-green-700"
                  : status === "STOPPED"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {status}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-6 py-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {section.items.map(([label, value]) => (
                  <Detail key={label} label={label} value={value} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 truncate">
        {String(value)}
      </span>
    </div>
  );
}
