// Pod from RunPod API
export interface Pod {
  id: string;
  name: string | null;
  status: "RUNNING" | "STARTING" | "STOPPED" | string;

  // Costs
  costPerHr: number;
  adjustedCostPerHr: number;

  // Hardware
  gpuTypeId: string;
  gpuCount: number;
  gpuDisplayName: string;

  vcpuCount: number;
  memoryInGb: number;

  volumeInGb: number;
  containerDiskInGb: number;

  publicIp: string | null;

  // Image
  imageName: string;

  // Ports
  portMappings: Record<string, number>;
  ports: string[];

  // Uptime
  lastStartedAt: string;
  uptimeInSeconds: number;
}

export interface PodDetails {
  id: string;
  name: string | null;

  adjustedCostPerHr: number;
  costPerHr: number;

  consumerUserId: string | null;

  // Image can be either 'image' or 'imageName' depending on endpoint
  image?: string;
  imageName?: string;

  interruptible?: boolean;
  lastStartedAt: string | null;
  lastStatusChange: string | null;
  desiredStatus?: string;
  createdAt?: string;

  // GPU - can be nested object OR flat fields
  gpu?: {
    id: string;
    count: number;
    displayName: string;
    securePrice?: number;
    communityPrice?: number;
    oneMonthPrice?: number;
    threeMonthPrice?: number;
    sixMonthPrice?: number;
    oneWeekPrice?: number;
    communitySpotPrice?: number;
    secureSpotPrice?: number;
  };
  // Flat GPU fields (when gpu object is not present)
  gpuCount?: number;
  machineId?: string;
  templateId?: string;

  // Machine - may be empty object {}
  machine?: {
    gpuTypeId?: string;
    gpuType?: {
      id: string;
      count: number;
      displayName: string;
    };
    cpuCount?: number;
    cpuType?: {
      id: string;
      displayName: string;
      cores: number;
      threadsPerCore: number;
    };
    location?: string;
    dataCenterId?: string;
  };

  vcpuCount: number;
  memoryInGb: number;
  volumeInGb: number;
  containerDiskInGb: number;
  volumeMountPath?: string;

  publicIp: string | null;
  portMappings?: Record<string, number>;
  ports?: string[];

  env?: Record<string, string>;

  networkVolume?: {
    id: string;
    name: string;
    size: number;
    dataCenterId: string;
  };

  savingsPlans?: Array<{
    costPerHr: number;
    endTime: string;
    gpuTypeId: string;
    id: string;
    podId: string;
    startTime: string;
  }>;
}

// Training Job Configuration
export interface JobConfig {
  // Resource Config
  name: string;
  cloudType: "SECURE" | "COMMUNITY";
  computeType: "GPU" | "CPU";
  imageName: string;
  gpuCount: number;
  gpuTypeIds: string[];
  ports: string[];
  containerDiskInGb: number;
  volumeInGb: number;
  volumeMountPath?: string;
  supportPublicIp: boolean;

  // HF Repo, Dataset & Tokens
  hfDatasetRepoId: string;
  hfDatasetDownloadToken: string;
  hfUploadRepoId: string;
  hfUploadToken: string;
  hfSessionName: string;

  // Checkpoint (Optional)
  hfCheckpointName?: string;
  hfCheckpointDownloadUrl?: string;
  hfCheckpointDownloadToken?: string;

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

export interface StopPodResponse {
  success: boolean;
  message: string;
}
