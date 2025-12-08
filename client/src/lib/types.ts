import { z } from "zod";

// RunPod Pod Status
export type PodStatus = "RUNNING" | "EXITED" | "STARTING" | "ERROR";

// Pod from RunPod API
export interface Pod {
  id: string;
  name: string;
  status: PodStatus;
  gpuTypeId: string;
  imageName: string;
  costPerHr: number;
  uptimeInSeconds: number;
}

// Training Job Configuration
export const JobConfigSchema = z.object({
  // Resource Config
  podName: z
    .string()
    .min(3, "Pod name required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid pod name"),
  gpuTypeId: z.string().min(1, "GPU type required"),
  cloudType: z.enum(["SECURE", "COMMUNITY"]),
  gpuCount: z.number().int().min(1).max(8),
  volumeInGb: z.number().int().min(10).max(1000),
  containerDiskInGb: z.number().int().min(10).max(1000),

  // Dataset & Tokens
  datasetRepo: z.string().min(1, "Dataset repo required"),
  hfDatasetToken: z.string().min(1, "HF dataset token required"),
  uploadRepo: z.string().min(1, "Upload repo required"),
  hfUploadToken: z.string().min(1, "HF upload token required"),
  sessionId: z.string().min(1, "Session ID required"),

  // Checkpoint (Optional)
  checkpointUrl: z.string().optional().or(z.literal("")),
  checkpointName: z.string().optional().or(z.literal("")),
  checkpointToken: z.string().optional().or(z.literal("")),

  // Hyperparameters
  maxEpochs: z.number().int().min(1).max(10000),
  checkpointEpochs: z.number().int().min(1).max(1000),
  batchSize: z.number().int().min(1).max(256),
  precision: z.enum(["16", "32"]),
  quality: z.enum(["low", "medium", "high"]),
  keepLastK: z.number().int().min(1).max(100),
  language: z.string().min(1, "Language required"),
  maxWorkers: z.number().int().min(1).max(16),
});

export type JobConfig = z.infer<typeof JobConfigSchema>;

// API Response Types
export interface CreatePodResponse {
  success: boolean;
  id: string;
  name: string;
}

export interface TerminatePodResponse {
  success: boolean;
  message: string;
}
