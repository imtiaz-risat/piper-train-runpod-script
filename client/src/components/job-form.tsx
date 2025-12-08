"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { JobConfigSchema, type JobConfig } from "@/lib/types";
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

  const methods = useForm<JobConfig>({
    resolver: zodResolver(JobConfigSchema),
    defaultValues: DEFAULT_JOB_CONFIG,
  });

  const onSubmit = async (data: JobConfig) => {
    if (step === "config") {
      setStep("dataset");
      return;
    }
    if (step === "dataset") {
      setStep("hyperparams");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await client.createPod(data);
      methods.reset();
      setStep("config");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pod");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Create Training Job</CardTitle>
        <CardDescription>
          Configure and deploy a new Piper TTS training pod
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                <TabsTrigger value="config">Resource Config</TabsTrigger>
                <TabsTrigger value="dataset">Dataset & Tokens</TabsTrigger>
                <TabsTrigger value="hyperparams">Hyperparameters</TabsTrigger>
              </TabsList>

              {/* Step 1: Resource Config */}
              <TabsContent value="config" className="space-y-4">
                <div className="space-y-2">
                  <Label>Pod Name</Label>
                  <Input
                    {...methods.register("podName")}
                    placeholder="piper-train-001"
                    className="bg-slate-50 border-slate-300"
                  />
                  {methods.formState.errors.podName && (
                    <p className="text-xs text-red-600">
                      {methods.formState.errors.podName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>GPU Type</Label>
                  <Select
                    value={methods.watch("gpuTypeId")}
                    onValueChange={(v) => methods.setValue("gpuTypeId", v)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-300">
                      <SelectValue />
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
                  <Label>Cloud Type</Label>
                  <Select
                    value={methods.watch("cloudType")}
                    onValueChange={(v) =>
                      methods.setValue("cloudType", v as any)
                    }
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPU Count</Label>
                    <Input
                      type="number"
                      {...methods.register("gpuCount", { valueAsNumber: true })}
                      className="bg-slate-50 border-slate-300"
                      min="1"
                      max="8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Volume (GB)</Label>
                    <Input
                      type="number"
                      {...methods.register("volumeInGb", {
                        valueAsNumber: true,
                      })}
                      className="bg-slate-50 border-slate-300"
                      min="10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Container Disk (GB)</Label>
                  <Input
                    type="number"
                    {...methods.register("containerDiskInGb", {
                      valueAsNumber: true,
                    })}
                    className="bg-slate-50 border-slate-300"
                    min="10"
                  />
                </div>
              </TabsContent>

              {/* Step 2: Dataset & Tokens */}
              <TabsContent value="dataset" className="space-y-4">
                <div className="space-y-2">
                  <Label>Dataset Repository ID</Label>
                  <Input
                    {...methods.register("datasetRepo")}
                    placeholder="username/dataset-name"
                    className="bg-slate-50 border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    HuggingFace dataset repo (e.g., myuser/piper-bn-dataset)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>HF Dataset Token</Label>
                  <Input
                    type="password"
                    {...methods.register("hfDatasetToken")}
                    placeholder="hf_XXXXXXXX"
                    className="bg-slate-50 border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Token with read access to dataset repo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Upload Repository ID</Label>
                  <Input
                    {...methods.register("uploadRepo")}
                    placeholder="username/checkpoints"
                    className="bg-slate-50 border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Where checkpoints will be uploaded
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>HF Upload Token</Label>
                  <Input
                    type="password"
                    {...methods.register("hfUploadToken")}
                    placeholder="hf_XXXXXXXX"
                    className="bg-slate-50 border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Token with write access to upload repo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Session ID</Label>
                  <Input
                    {...methods.register("sessionId")}
                    placeholder="session-01"
                    className="bg-slate-50 border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Folder name for this training session
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm font-medium mb-3 text-slate-900">
                    Resume from Checkpoint (Optional)
                  </p>
                  <div className="space-y-3">
                    <Input
                      {...methods.register("checkpointUrl")}
                      placeholder="https://huggingface.co/.../checkpoint.ckpt"
                      className="bg-slate-50 border-slate-300"
                    />
                    <Input
                      {...methods.register("checkpointName")}
                      placeholder="checkpoint-name.ckpt"
                      className="bg-slate-50 border-slate-300"
                    />
                    <Input
                      type="password"
                      {...methods.register("checkpointToken")}
                      placeholder="hf_XXXXXXXX (optional)"
                      className="bg-slate-50 border-slate-300"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Step 3: Hyperparameters */}
              <TabsContent value="hyperparams" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Epochs</Label>
                    <Input
                      type="number"
                      {...methods.register("maxEpochs", {
                        valueAsNumber: true,
                      })}
                      className="bg-slate-50 border-slate-300"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Checkpoint Epochs</Label>
                    <Input
                      type="number"
                      {...methods.register("checkpointEpochs", {
                        valueAsNumber: true,
                      })}
                      className="bg-slate-50 border-slate-300"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      {...methods.register("batchSize", {
                        valueAsNumber: true,
                      })}
                      className="bg-slate-50 border-slate-300"
                      min="1"
                      max="256"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keep Last K</Label>
                    <Input
                      type="number"
                      {...methods.register("keepLastK", {
                        valueAsNumber: true,
                      })}
                      className="bg-slate-50 border-slate-300"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precision</Label>
                    <Select
                      value={methods.watch("precision")}
                      onValueChange={(v) =>
                        methods.setValue("precision", v as any)
                      }
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
                      value={methods.watch("quality")}
                      onValueChange={(v) =>
                        methods.setValue("quality", v as any)
                      }
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
                    value={methods.watch("language")}
                    onValueChange={(v) => methods.setValue("language", v)}
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
                    {...methods.register("maxWorkers", { valueAsNumber: true })}
                    className="bg-slate-50 border-slate-300"
                    min="1"
                    max="16"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (step === "config") methods.reset();
                  else if (step === "dataset") setStep("config");
                  else setStep("dataset");
                }}
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
        </FormProvider>
      </CardContent>
    </Card>
  );
}
