import type {
  JobConfig,
  Pod,
  CreatePodResponse,
  TerminatePodResponse,
  StopPodResponse,
  PodDetails,
} from "./types";
import type {
  CreateTrainingLogRequest,
  CreateTrainingLogResponse,
  TrainingModuleType,
} from "./training-types";
import { getGpuCostPerHr } from "./constants";

// Use internal API proxy routes
const API_BASE_URL = "/api/v1";

export class APIClient {
  constructor() {
    // API key is now managed server-side
  }

  /**
   * Get all active pods for the user
   */
  async getPods(): Promise<Pod[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pods`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pods: ${response.statusText}`);
      }

      const data = await response.json();
      const pods = data.pods || [];

      return pods.map((pod: any) => {
        const startedAt = pod.lastStartedAt
          ? new Date(pod.lastStartedAt)
          : null;
        const now = new Date();

        const uptimeInSeconds = startedAt
          ? Math.floor((now.getTime() - startedAt.getTime()) / 1000)
          : 0;

        return {
          id: pod.id,
          name: pod.name || null,

          // Status from RunPod
          status: pod.desiredStatus || "UNKNOWN",

          // Costs
          costPerHr: Number(pod.costPerHr) || 0,
          adjustedCostPerHr: Number(pod.adjustedCostPerHr) || 0,

          // GPU - RunPod returns flat structure, not nested
          gpuTypeId: pod.gpu?.id || pod.machineId || "unknown",
          gpuCount: pod.gpu?.count || pod.gpuCount || 0,
          gpuDisplayName:
            pod.gpu?.displayName || pod.imageName || "Unknown GPU",

          // CPU + RAM
          vcpuCount: pod.vcpuCount || 0,
          memoryInGb: pod.memoryInGb || 0,

          // Storage
          volumeInGb: pod.volumeInGb || 0,
          containerDiskInGb: pod.containerDiskInGb || 0,

          // Network
          publicIp: pod.publicIp || null,
          portMappings: pod.portMappings || {},
          ports: pod.ports || [],

          // Image
          imageName: pod.imageName || pod.image || "",

          // Uptime
          lastStartedAt: pod.lastStartedAt || null,
          uptimeInSeconds,
        };
      });
    } catch (error) {
      console.error("Error fetching pods:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific pod by ID
   */
  async getPodById(podId: string): Promise<PodDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/pods/${podId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pod details: ${response.statusText}`);
      }

      return (await response.json()) as PodDetails;
    } catch (err) {
      console.error("Error fetching pod details:", err);
      throw err;
    }
  }

  /**
   * Create a new Pod with training configuration
   */
  async createPod(config: JobConfig): Promise<CreatePodResponse> {
    try {
      const payload = {
        name: config.name || "default_piper_training_pod",
        imageName:
          config.imageName ||
          "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
        gpuTypeIds: config.gpuTypeIds || ["NVIDIA GeForce RTX 3070"],
        cloudType: config.cloudType || "COMMUNITY",
        computeType: config.computeType || "GPU",
        gpuCount: config.gpuCount || 1,
        volumeInGb: config.volumeInGb || 20,
        containerDiskInGb: config.containerDiskInGb || 50,
        volumeMountPath: config.volumeMountPath || "/workspace",
        supportPublicIp: config.supportPublicIp || true,

        // Ports
        ports: config.ports || ["8888/http", "22/tcp"],

        // Environment variables
        env: this.buildEnvironmentVariables(config),

        // Docker commands to start the pod
        dockerStartCmd: [
          "bash",
          "-c",
          `set -ex; \
          apt-get update && apt-get install -y dos2unix jq; \
          curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/piper_train_runpod.sh -o train.sh; \
          curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/kill_pod.sh -o kill_pod.sh; \
          dos2unix train.sh kill_pod.sh; \
          chmod +x train.sh kill_pod.sh; \
          bash train.sh; \
          bash kill_pod.sh; \
          sleep infinity`,
        ],
      };

      const response = await fetch(`${API_BASE_URL}/pods`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Create pod failed:", errorData);
        throw new Error(`Failed to create pod: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        id: data.id,
        name: payload.name,
      };
    } catch (error) {
      console.error("Error creating pod:", error);
      throw error;
    }
  }

  /**
   * Stop a pod (keeps it available but not running)
   */
  async stopPod(podId: string): Promise<StopPodResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/pods/${podId}/stop`, {
        method: "POST",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to stop pod: ${response.statusText}`);
      }

      return {
        success: true,
        message: `Pod ${podId} stopped successfully`,
      };
    } catch (error) {
      console.error("Error stopping pod:", error);
      throw error;
    }
  }

  /**
   * Terminate/delete a pod
   */
  async terminatePod(podId: string): Promise<TerminatePodResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/pods/${podId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to terminate pod: ${response.statusText}`);
      }

      return {
        success: true,
        message: `Pod ${podId} terminated successfully`,
      };
    } catch (error) {
      console.error("Error terminating pod:", error);
      throw error;
    }
  }

  // ------------------------------------------------------------------------- //

  /**
   * Build environment variables for the training job
   * Note: RUNPOD_KILLER_API_KEY is injected server-side for security
   */
  private buildEnvironmentVariables(config: JobConfig): Record<string, string> {
    return {
      // HuggingFace dataset & upload
      HF_DATASET_REPO_ID: config.hfDatasetRepoId,
      HF_DATASET_TOKEN: config.hfDatasetDownloadToken,
      HF_UPLOAD_REPO_ID: config.hfUploadRepoId,
      HF_UPLOAD_TOKEN: config.hfUploadToken,
      HF_UPLOAD_SESSION_ID: config.hfSessionName,

      // Checkpoint (optional)
      HF_CHECKPOINT_NAME: config.hfCheckpointName || "",
      HF_CHECKPOINT_URL: config.hfCheckpointDownloadUrl || "",
      HF_CHECKPOINT_TOKEN: config.hfCheckpointDownloadToken || "",

      // Hyperparameters
      MAX_EPOCHS: config.maxEpochs.toString(),
      CHECKPOINT_EPOCHS: config.checkpointEpochs.toString(),
      BATCH_SIZE: config.batchSize.toString(),
      PRECISION: config.precision,
      QUALITY: config.quality,
      KEEP_LAST_K: config.keepLastK.toString(),
      LANGUAGE: config.language,
      MAX_WORKERS: config.maxWorkers.toString(),

      // Pod metadata
      POD_NAME: config.name,
    };
  }

  // ------------------------------------------------------------------------- //
  // Training Session Logging Methods
  // ------------------------------------------------------------------------- //

  /**
   * Start a new training session log
   */
  async startTrainingSession(
    config: JobConfig,
    username: string,
    podId: string,
    podName: string | null,
    trainingType: TrainingModuleType = "piper"
  ): Promise<CreateTrainingLogResponse> {
    try {
      const payload: CreateTrainingLogRequest = {
        username,
        podId,
        podName,
        trainingType,
        config: {
          hfDatasetRepoId: config.hfDatasetRepoId,
          hfUploadRepoId: config.hfUploadRepoId,
          hfSessionName: config.hfSessionName,
          hfCheckpointName: config.hfCheckpointName,
          hfCheckpointDownloadUrl: config.hfCheckpointDownloadUrl,
          maxEpochs: config.maxEpochs,
          checkpointEpochs: config.checkpointEpochs,
          batchSize: config.batchSize,
          precision: config.precision,
          quality: config.quality,
          keepLastK: config.keepLastK,
          language: config.language,
          maxWorkers: config.maxWorkers,
        },
        pod: {
          gpuType: config.gpuTypeIds[0] || "unknown",
          gpuCount: config.gpuCount,
          cloudType: config.cloudType,
          costPerHr: getGpuCostPerHr(config.gpuTypeIds[0] || ""),
          imageName: config.imageName,
          volumeInGb: config.volumeInGb,
          containerDiskInGb: config.containerDiskInGb,
        },
      };

      const response = await fetch(`${API_BASE_URL}/logs/training`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create training log: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating training session log:", error);
      throw error;
    }
  }

  // ------------------------------------------------------------------------- //

  /**
   * Get headers for API requests (API key is now managed server-side)
   */
  private getHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }
}

// Create singleton instance
let client: APIClient | null = null;

export function initializeAPIClient(): APIClient {
  if (!client) {
    client = new APIClient();
  }
  return client;
}

export function getAPIClient(): APIClient | null {
  return client;
}
