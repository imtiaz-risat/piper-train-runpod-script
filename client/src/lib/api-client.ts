import axios, { type AxiosError } from "axios";
import type {
  JobConfig,
  Pod,
  CreatePodResponse,
  TerminatePodResponse,
} from "./types";

const RUNPOD_BASE_URL = "https://rest.runpod.io/v1";

// Mock data for development/testing
const MOCK_PODS: Pod[] = [
  {
    id: "pod-1",
    name: "piper-bn-train-001",
    status: "RUNNING",
    gpuTypeId: "NVIDIA RTX A4000",
    imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04",
    costPerHr: 0.74,
    uptimeInSeconds: 3600,
  },
  {
    id: "pod-2",
    name: "piper-en-train-002",
    status: "EXITED",
    gpuTypeId: "NVIDIA A100 80GB PCIe",
    imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04",
    costPerHr: 2.32,
    uptimeInSeconds: 7200,
  },
];

export class APIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all active pods for the user
   */
  async getPods(): Promise<Pod[]> {
    try {
      const response = await axios.get(`${RUNPOD_BASE_URL}/pods`, {
        headers: this.getHeaders(),
      });

      return (response.data.pods || []).map((pod: any) => ({
        id: pod.id,
        name: pod.name,
        status: pod.status || "UNKNOWN",
        gpuTypeId: pod.gpuTypeId || "Unknown",
        imageName: pod.imageName || "",
        costPerHr: pod.costPerHr || 0,
        uptimeInSeconds: pod.uptimeInSeconds || 0,
      }));
    } catch (error) {
      console.error("[v0] Error fetching pods:", error);
      throw error;
    }
  }

  /**
   * Create a new Pod with training configuration
   */
  async createPod(config: JobConfig): Promise<CreatePodResponse> {
    try {
      const payload = {
        name: config.podName,
        imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04",
        gpuTypeId: config.gpuTypeId,
        cloudType: config.cloudType,
        gpuCount: config.gpuCount,
        volumeInGb: config.volumeInGb,
        containerDiskInGb: config.containerDiskInGb,
        minVcpuCount: 2,
        minMemoryInGb: 15,
        dockerStartCmd: [
          "bash",
          "-c",
          `set -ex; apt-get update && apt-get install -y dos2unix jq; curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/piper_train_runpod.sh -o train.sh; curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/kill_pod.sh -o kill_pod.sh; dos2unix train.sh kill_pod.sh; chmod +x train.sh kill_pod.sh; bash train.sh; bash kill_pod.sh; sleep infinity`,
        ],
        env: this.buildEnvironmentVariables(config),
      };

      console.log("[v0] Creating pod with payload:", payload);

      const response = await axios.post(`${RUNPOD_BASE_URL}/pods`, payload, {
        headers: this.getHeaders(),
      });

      return {
        success: true,
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("[v0] Error creating pod:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });
      throw error;
    }
  }

  /**
   * Terminate/delete a pod
   */
  async terminatePod(podId: string): Promise<TerminatePodResponse> {
    try {
      await axios.delete(`${RUNPOD_BASE_URL}/pods/${podId}`, {
        headers: this.getHeaders(),
      });

      return {
        success: true,
        message: `Pod ${podId} terminated successfully`,
      };
    } catch (error) {
      console.error("[v0] Error terminating pod:", error);
      throw error;
    }
  }

  /**
   * Build environment variables for the training job
   */
  private buildEnvironmentVariables(config: JobConfig): Record<string, string> {
    return {
      HF_DATASET_REPO_ID: config.datasetRepo,
      HF_DATASET_TOKEN: config.hfDatasetToken,
      HF_UPLOAD_REPO_ID: config.uploadRepo,
      HF_UPLOAD_TOKEN: config.hfUploadToken,
      HF_UPLOAD_SESSION_ID: config.sessionId,
      HF_CHECKPOINT_URL: config.checkpointUrl || "",
      HF_CHECKPOINT_NAME: config.checkpointName || "",
      HF_CHECKPOINT_TOKEN: config.checkpointToken || "",
      MAX_EPOCHS: config.maxEpochs.toString(),
      CHECKPOINT_EPOCHS: config.checkpointEpochs.toString(),
      BATCH_SIZE: config.batchSize.toString(),
      PRECISION: config.precision,
      QUALITY: config.quality,
      KEEP_LAST_K: config.keepLastK.toString(),
      LANGUAGE: config.language,
      MAX_WORKERS: config.maxWorkers.toString(),
      POD_NAME: config.podName,
      RUNPOD_API_KEY: this.apiKey,
    };
  }

  /**
   * Get authorization headers for API requests
   */
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }
}

// Create singleton instance (only set when API key is available)
let client: APIClient | null = null;

export function initializeAPIClient(apiKey: string): APIClient {
  client = new APIClient(apiKey);
  return client;
}

export function getAPIClient(): APIClient | null {
  return client;
}
