import type {
  JobConfig,
  Pod,
  CreatePodResponse,
  TerminatePodResponse,
  StopPodResponse,
  PodDetails,
} from "./types";

// Use internal API proxy routes
const API_BASE_URL = "/api/v1";

export class APIClient {
  private runpod_apiKey: string;

  constructor(runpod_apiKey: string) {
    this.runpod_apiKey = runpod_apiKey;
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
        name: config.name || "Default Training Pod",
        imageName:
          config.imageName ||
          "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
        gpuTypeIds: config.gpuTypeIds || ["NVIDIA A100 80GB PCIe"],
        cloudType: config.cloudType || "SECURE",
        computeType: config.computeType || "GPU",
        gpuCount: config.gpuCount || 1,
        volumeInGb: config.volumeInGb || 20,
        containerDiskInGb: config.containerDiskInGb || 80,
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
          `set -ex; apt-get update && apt-get install -y dos2unix jq; \
          curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/piper_train_runpod.sh -o train.sh; \
          curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/kill_pod.sh -o kill_pod.sh; \
          dos2unix train.sh kill_pod.sh; chmod +x train.sh kill_pod.sh; bash train.sh; bash kill_pod.sh; sleep infinity`,
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

      // API key
      RUNPOD_API_KEY: this.runpod_apiKey,
    };
  }

  /**
   * Get headers for API requests (passes API key to server-side proxy)
   */
  private getHeaders() {
    return {
      "x-runpod-api-key": this.runpod_apiKey,
      "Content-Type": "application/json",
    };
  }
}

// Create singleton instance (only set when API key is available)
let client: APIClient | null = null;

export function initializeAPIClient(runpod_apiKey: string): APIClient {
  client = new APIClient(runpod_apiKey);
  return client;
}

export function getAPIClient(): APIClient | null {
  return client;
}
