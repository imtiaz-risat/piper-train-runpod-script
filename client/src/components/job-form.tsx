"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Loader2,
  Cpu,
  Database,
  Settings,
  RotateCcw,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobConfig } from "@/lib/types";
import type { APIClient } from "@/lib/api-client";
import {
  DEFAULT_JOB_CONFIG,
  GPU_TYPES,
  QUALITY_OPTIONS,
  PRECISION_OPTIONS,
  LANGUAGES,
} from "@/lib/constants";

interface JobFormProps {
  client: APIClient;
  onSuccess: (sessionId?: string) => void;
  formData: JobConfig;
  onFormDataChange: Dispatch<SetStateAction<JobConfig>>;
  username: string;
}

// Helper to detect cloud type from GPU label
function getCloudTypeFromGpu(gpuId: string): "COMMUNITY" | "SECURE" {
  const gpu = GPU_TYPES.find((g) => g.id === gpuId);
  if (gpu?.label.includes("Community")) return "COMMUNITY";
  if (gpu?.label.includes("Secure")) return "SECURE";
  return "COMMUNITY";
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-lg bg-purple-100 mt-0.5">
        <Icon className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function JobForm({
  client,
  onSuccess,
  formData,
  onFormDataChange: setFormData,
  username,
}: JobFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update cloud type when GPU changes
  useEffect(() => {
    const gpuId = formData.gpuTypeIds[0];
    if (gpuId) {
      const cloudType = getCloudTypeFromGpu(gpuId);
      setFormData((prev) => ({ ...prev, cloudType }));
    }
  }, [formData.gpuTypeIds]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      };

      // Auto-set checkpoint name and maxEpochs if URL is entered
      if (name === "hfCheckpointDownloadUrl" && value) {
        try {
          const url = new URL(value);
          const segments = url.pathname.split("/");
          const fileName = decodeURIComponent(segments[segments.length - 1]);
          updated.hfCheckpointName = fileName;

          // Extract epoch from filename: assume format epoch=XXXX-step=YYYY.ckpt
          const match = fileName.match(/epoch=(\d+)-step=(\d+)\.ckpt/);
          if (match) {
            const currentEpoch = parseInt(match[1], 10);
            updated.maxEpochs = currentEpoch + 101;
          }
        } catch {
          // ignore invalid URLs
        }
      }

      return updated;
    });
  };

  const handleSelectChange = (name: keyof JobConfig, value: string) => {
    if (name === "supportPublicIp") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else if (name === "gpuTypeIds") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePortsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ports = e.target.value
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, ports }));
  };

  const validateForm = (): string | null => {
    if (!formData.name || formData.name.length < 3) {
      return "Pod name must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      return "Pod name can only contain letters, numbers, underscores, and hyphens";
    }
    if (!formData.hfDatasetRepoId) return "Dataset Repo ID is required";
    if (!formData.hfDatasetDownloadToken) return "Dataset Token is required";
    if (!formData.hfUploadRepoId) return "Upload Repo ID is required";
    if (!formData.hfUploadToken) return "Upload Token is required";
    if (!formData.hfSessionName) return "Session Name is required";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the pod
      const podResult = await client.createPod(formData);

      // Create training session log
      let sessionId: string | undefined;
      try {
        const logResult = await client.startTrainingSession(
          formData,
          username,
          podResult.id,
          podResult.name
        );
        sessionId = logResult.sessionId;
        console.log("Training session log created:", sessionId);
      } catch (logErr) {
        // Log error but don't fail the pod creation
        console.error("Failed to create training session log:", logErr);
      }

      setFormData({ ...DEFAULT_JOB_CONFIG });
      onSuccess(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pod");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_JOB_CONFIG });
    setError(null);
  };

  return (
    <Card className="border border-slate-200 shadow-sm rounded-lg">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-xl">Create Training Job</CardTitle>
        <CardDescription>
          Configure all settings below and deploy a new Piper TTS training pod
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          {/* Section 1: GPU & Resources */}
          <div id="gpu-resources" className="p-6 border-b border-slate-100">
            <SectionHeader
              icon={Cpu}
              title="GPU & Resources"
              description="Select your GPU and configure compute resources"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-700">Pod Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="piper-train-001"
                  className="bg-slate-50 border-slate-200 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">GPU Type</Label>
                <Select
                  value={formData.gpuTypeIds[0] || ""}
                  onValueChange={(v) => handleSelectChange("gpuTypeIds", v)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 w-full min-w-0 [&>span]:truncate">
                    <SelectValue placeholder="Select GPU" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {GPU_TYPES.map((gpu) => (
                      <SelectItem key={gpu.id} value={gpu.id}>
                        {gpu.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Cloud Type</Label>
                <div className="h-10 px-3 flex items-center bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-600">
                  {formData.cloudType === "COMMUNITY"
                    ? "Community Cloud"
                    : "Secure Cloud"}
                  <span className="ml-auto text-xs text-slate-400">
                    (auto-selected)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">GPU Count</Label>
                <Input
                  type="number"
                  name="gpuCount"
                  value={formData.gpuCount}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                  max={8}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Volume (GB)</Label>
                <Input
                  type="number"
                  name="volumeInGb"
                  value={formData.volumeInGb}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={10}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Container Disk (GB)</Label>
                <Input
                  type="number"
                  name="containerDiskInGb"
                  value={formData.containerDiskInGb}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={10}
                />
              </div>
            </div>

            {/* Advanced Options - Collapsed by default feel */}
            <details className="mt-5">
              <summary className="text-sm text-purple-600 cursor-pointer hover:text-purple-700 font-medium">
                Advanced Options
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label className="text-slate-700">Docker Image</Label>
                  <Input
                    name="imageName"
                    value={formData.imageName}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Ports</Label>
                  <Input
                    value={formData.ports.join(", ")}
                    onChange={handlePortsChange}
                    placeholder="8888/http, 22/tcp"
                    className="bg-slate-50 border-slate-200 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Public IP</Label>
                  <Select
                    value={formData.supportPublicIp ? "true" : "false"}
                    onValueChange={(v) =>
                      handleSelectChange("supportPublicIp", v)
                    }
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </details>
          </div>

          {/* Section 2: Dataset & Tokens */}
          <div id="dataset-tokens" className="p-6 border-b border-slate-100">
            <SectionHeader
              icon={Database}
              title="Dataset & Tokens"
              description="Configure your Hugging Face dataset and authentication"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-700">Dataset Repo ID</Label>
                <Input
                  name="hfDatasetRepoId"
                  value={formData.hfDatasetRepoId}
                  onChange={handleInputChange}
                  placeholder="username/dataset-name"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Dataset Token (Read)</Label>
                <Input
                  type="password"
                  name="hfDatasetDownloadToken"
                  value={formData.hfDatasetDownloadToken}
                  onChange={handleInputChange}
                  placeholder="hf_XXXXXXXX"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Upload Repo ID</Label>
                <Input
                  name="hfUploadRepoId"
                  value={formData.hfUploadRepoId}
                  onChange={handleInputChange}
                  placeholder="username/checkpoints"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Upload Token (Write)</Label>
                <Input
                  type="password"
                  name="hfUploadToken"
                  value={formData.hfUploadToken}
                  onChange={handleInputChange}
                  placeholder="hf_XXXXXXXX"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-slate-700">Session Name</Label>
                <Input
                  name="hfSessionName"
                  value={formData.hfSessionName}
                  onChange={handleInputChange}
                  placeholder="voice-name-v1"
                  className="bg-slate-50 border-slate-200 max-w-md"
                />
                <p className="text-xs text-slate-400">
                  Folder name for organizing checkpoints in your upload repo
                </p>
              </div>
            </div>

            {/* Checkpoint Resume */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Resume from Checkpoint
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  name="hfCheckpointDownloadUrl"
                  value={formData.hfCheckpointDownloadUrl || ""}
                  onChange={handleInputChange}
                  placeholder="Checkpoint URL"
                  className="bg-slate-50 border-slate-200 text-sm"
                />
                <Input
                  name="hfCheckpointName"
                  value={formData.hfCheckpointName || ""}
                  onChange={handleInputChange}
                  placeholder="epoch=XXX-step=XXX.ckpt"
                  className="bg-slate-50 border-slate-200 text-sm"
                />
                <Input
                  type="password"
                  name="hfCheckpointDownloadToken"
                  value={formData.hfCheckpointDownloadToken || ""}
                  onChange={handleInputChange}
                  placeholder="Token (if private)"
                  className="bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Training Parameters */}
          <div id="training-params" className="p-6 border-b border-slate-100">
            <SectionHeader
              icon={Settings}
              title="Training Parameters"
              description="Configure hyperparameters and training settings"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-700">Max Epochs</Label>
                <Input
                  type="number"
                  name="maxEpochs"
                  value={formData.maxEpochs}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Checkpoint Every</Label>
                <Input
                  type="number"
                  name="checkpointEpochs"
                  value={formData.checkpointEpochs}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Batch Size</Label>
                <Input
                  type="number"
                  name="batchSize"
                  value={formData.batchSize}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                  max={32}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Keep Last K</Label>
                <Input
                  type="number"
                  name="keepLastK"
                  value={formData.keepLastK}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Precision</Label>
                <Select
                  value={formData.precision}
                  onValueChange={(v) => handleSelectChange("precision", v)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {PRECISION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Quality</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(v) => handleSelectChange("quality", v)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {QUALITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(v) => handleSelectChange("language", v)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Max Workers</Label>
                <Input
                  type="number"
                  name="maxWorkers"
                  value={formData.maxWorkers}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  min={1}
                  max={8}
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Sticky Footer with Actions */}
          <div className="sticky bottom-0 p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="sm:w-auto"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Training Pod
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
