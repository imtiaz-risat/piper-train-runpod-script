/**
 * Training Session Log Types
 *
 * These types define the structure of training session logs that are
 * stored locally and/or uploaded to S3 for archival.
 */

// Training module types (extensible for future modules)
export type TrainingModuleType = "piper" | "gemma" | "nemo";

// User information captured in logs
export interface TrainingSessionUser {
  username: string;
  sessionStartedAt: string; // ISO-8601
}

// Pod information captured in logs
export interface TrainingSessionPod {
  id: string;
  name: string | null;
  gpuType: string;
  gpuCount: number;
  cloudType: "SECURE" | "COMMUNITY";
  costPerHr: number;
  imageName: string;
  volumeInGb: number;
  containerDiskInGb: number;
}

// Training configuration subset for logging (from JobConfig)
export interface TrainingSessionConfig {
  // HuggingFace Dataset & Upload
  hfDatasetRepoId: string;
  hfUploadRepoId: string;
  hfSessionName: string;

  // Checkpoint (if any)
  hfCheckpointName?: string;
  hfCheckpointDownloadUrl?: string;

  // Hyperparameters
  maxEpochs: number;
  checkpointEpochs: number;
  batchSize: number;
  precision: "16" | "32";
  quality: "low" | "medium" | "high";
  keepLastK: number;
  language: string;
  maxWorkers: number;
}

// Complete training session log structure
export interface TrainingSessionLog {
  sessionId: string;
  createdAt: string; // ISO-8601
  version: string; // Log schema version

  // Core data
  user: TrainingSessionUser;
  pod: TrainingSessionPod;
  trainingType: TrainingModuleType;
  config: TrainingSessionConfig;

  // S3 metadata (populated if uploaded)
  s3?: {
    bucket: string;
    key: string;
    uploadedAt: string;
  };
}

// API request types
export interface CreateTrainingLogRequest {
  username: string;
  podId: string;
  podName: string | null;
  trainingType: TrainingModuleType;
  config: TrainingSessionConfig;
  pod: Omit<TrainingSessionPod, "id" | "name">;
}

export interface CreateTrainingLogResponse {
  success: boolean;
  sessionId: string;
  logFilePath: string;
}
