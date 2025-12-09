"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobConfig } from "@/lib/types";
import type { APIClient } from "@/lib/api-client";
import {
  DEFAULT_JOB_CONFIG,
  GPU_TYPES,
  CLOUD_TYPES,
  QUALITY_OPTIONS,
  PRECISION_OPTIONS,
  LANGUAGES,
} from "@/lib/constants";

interface JobFormProps {
  client: APIClient;
  onSuccess: () => void;
}

export function JobForm({ client, onSuccess }: JobFormProps) {
  const [step, setStep] = useState<"config" | "dataset" | "hyperparams">(
    "config"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobConfig>({
    ...DEFAULT_JOB_CONFIG,
  });

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
            updated.maxEpochs = currentEpoch + 101; // auto add 100
          }
        } catch {
          // ignore invalid URLs
        }
      }

      return updated;
    });
  };

  // Handle select changes
  const handleSelectChange = (name: keyof JobConfig, value: string) => {
    if (name === "supportPublicIp") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else if (name === "gpuTypeIds") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle ports input (comma separated)
  const handlePortsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ports = e.target.value
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, ports }));
  };

  // Simple validation
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

    if (step === "config") {
      setStep("dataset");
      return;
    }
    if (step === "dataset") {
      setStep("hyperparams");
      return;
    }

    // Final submission
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await client.createPod(formData);
      setFormData({ ...DEFAULT_JOB_CONFIG });
      setStep("config");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pod");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (step === "config") {
      setFormData({ ...DEFAULT_JOB_CONFIG });
    } else if (step === "dataset") {
      setStep("config");
    } else {
      setStep("dataset");
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm rounded-lg max-w-5xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle>Create Training Job</CardTitle>
        <CardDescription>
          Configure and deploy a new Piper TTS training pod
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={step} onValueChange={(v) => setStep(v as typeof step)}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 border border-slate-200 rounded-md overflow-hidden">
              <TabsTrigger value="config">Resource Config</TabsTrigger>
              <TabsTrigger value="dataset">Dataset & Tokens</TabsTrigger>
              <TabsTrigger value="hyperparams">Hyperparameters</TabsTrigger>
            </TabsList>

            {/* Step 1: Resource Config */}
            <TabsContent value="config" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Pod Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="piper-train-001"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Compute Type</Label>
                  <Select
                    value={formData.computeType}
                    onValueChange={(v) => handleSelectChange("computeType", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {["GPU", "CPU"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>GPU Type(s)</Label>
                  <Select
                    value={formData.gpuTypeIds[0] || ""}
                    onValueChange={(v) => handleSelectChange("gpuTypeIds", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue placeholder="Select GPU" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {GPU_TYPES.map((gpu) => (
                        <SelectItem key={gpu.id} value={gpu.id}>
                          {gpu.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>GPU Count</Label>
                  <Input
                    type="number"
                    name="gpuCount"
                    value={formData.gpuCount}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={1}
                    max={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cloud Type</Label>
                  <Select
                    value={formData.cloudType}
                    onValueChange={(v) => handleSelectChange("cloudType", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {CLOUD_TYPES.map((cloud) => (
                        <SelectItem key={cloud.id} value={cloud.id}>
                          {cloud.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Image Name</Label>
                  <Input
                    name="imageName"
                    value={formData.imageName}
                    onChange={handleInputChange}
                    placeholder="Docker image"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ports (comma separated)</Label>
                  <Input
                    value={formData.ports.join(", ")}
                    onChange={handlePortsChange}
                    placeholder="8888/http, 22/tcp"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Volume (GB)</Label>
                  <Input
                    type="number"
                    name="volumeInGb"
                    value={formData.volumeInGb}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Container Disk (GB)</Label>
                  <Input
                    type="number"
                    name="containerDiskInGb"
                    value={formData.containerDiskInGb}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Support Public IP</Label>
                  <Select
                    value={formData.supportPublicIp ? "true" : "false"}
                    onValueChange={(v) =>
                      handleSelectChange("supportPublicIp", v)
                    }
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Step 2: Dataset & Tokens */}
            <TabsContent value="dataset" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Dataset Repo ID</Label>
                  <Input
                    name="hfDatasetRepoId"
                    value={formData.hfDatasetRepoId}
                    onChange={handleInputChange}
                    placeholder="username/dataset-name"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dataset Token</Label>
                  <Input
                    type="password"
                    name="hfDatasetDownloadToken"
                    value={formData.hfDatasetDownloadToken}
                    onChange={handleInputChange}
                    placeholder="hf_XXXXXXXX"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Repo ID</Label>
                  <Input
                    name="hfUploadRepoId"
                    value={formData.hfUploadRepoId}
                    onChange={handleInputChange}
                    placeholder="username/checkpoints"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Token</Label>
                  <Input
                    type="password"
                    name="hfUploadToken"
                    value={formData.hfUploadToken}
                    onChange={handleInputChange}
                    placeholder="hf_XXXXXXXX"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Name</Label>
                  <Input
                    name="hfSessionName"
                    value={formData.hfSessionName}
                    onChange={handleInputChange}
                    placeholder="session-01"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm font-medium mb-3 text-slate-900">
                  Resume from Checkpoint
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    name="hfCheckpointDownloadUrl"
                    value={formData.hfCheckpointDownloadUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://huggingface.co/.../checkpoint.ckpt"
                    className="bg-slate-50 border-slate-300"
                  />
                  <Input
                    name="hfCheckpointName"
                    value={formData.hfCheckpointName || ""}
                    onChange={handleInputChange}
                    placeholder="checkpoint-name.ckpt"
                    className="bg-slate-50 border-slate-300"
                  />
                  <Input
                    type="password"
                    name="hfCheckpointDownloadToken"
                    value={formData.hfCheckpointDownloadToken || ""}
                    onChange={handleInputChange}
                    placeholder="hf_XXXXXXXX"
                    className="bg-slate-50 border-slate-300"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Hyperparameters */}
            <TabsContent value="hyperparams" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max Epochs</Label>
                  <Input
                    type="number"
                    name="maxEpochs"
                    value={formData.maxEpochs}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Checkpoint Epochs</Label>
                  <Input
                    type="number"
                    name="checkpointEpochs"
                    value={formData.checkpointEpochs}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch Size</Label>
                  <Input
                    type="number"
                    name="batchSize"
                    value={formData.batchSize}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={1}
                    max={32}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Keep Last K</Label>
                  <Input
                    type="number"
                    name="keepLastK"
                    value={formData.keepLastK}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-300"
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Precision</Label>
                  <Select
                    value={formData.precision}
                    onValueChange={(v) => handleSelectChange("precision", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {PRECISION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select
                    value={formData.quality}
                    onValueChange={(v) => handleSelectChange("quality", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {QUALITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(v) => handleSelectChange("language", v)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Workers</Label>
                <Input
                  type="number"
                  name="maxWorkers"
                  value={formData.maxWorkers}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-300"
                  min={1}
                  max={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="sm:flex-none"
            >
              {step === "config" ? "Reset" : "Back"}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {step === "hyperparams" ? "Deploying..." : "Next"}
                </>
              ) : step === "hyperparams" ? (
                "Deploy Training Job"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
