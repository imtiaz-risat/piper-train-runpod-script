import { JobConfig } from "./types";

export const GPU_TYPES = [
  {
    id: "NVIDIA GeForce RTX 3070",
    label: "RTX 3070 (Community Cloud) - 0.13$/hr",
  },
  {
    id: "NVIDIA GeForce RTX 3080",
    label: "RTX 3080 (Community Cloud) - 0.17$/hr",
  },
  {
    id: "NVIDIA GeForce RTX 3090",
    label: "RTX 3090 (Community Cloud) - 0.22$/hr",
  },
  { id: "NVIDIA A30", label: "A30 (Community Cloud) - 0.22$/hr" },
  { id: "NVIDIA A40", label: "A40 (Secure Cloud) - 0.40$/hr" },
  { id: "NVIDIA A100 80GB PCIe", label: "A100 PCIe (Secure Cloud) - 1.39$/hr" },
];

export const CLOUD_TYPES = [
  { id: "COMMUNITY", label: "Community Cloud (Cheaper)" },
  { id: "SECURE", label: "Secure Cloud (Premium)" },
];

export const QUALITY_OPTIONS = [
  { value: "low", label: "Low (Fastest)" },
  { value: "medium", label: "Medium (Balanced)" },
  { value: "high", label: "High (Best quality)" },
];

export const PRECISION_OPTIONS = [
  { value: "16", label: "16-bit (Recommended)" },
  { value: "32", label: "32-bit" },
];

export const LANGUAGES = [
  { code: "bn", name: "Bengali" },
  { code: "ne", name: "Nepali" },
];

const now = new Date();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();

export const DEFAULT_JOB_CONFIG: JobConfig = {
  name: `piper_training_pod_${day}-${month}-${year}`,
  computeType: "GPU",
  imageName: "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
  gpuTypeIds: ["NVIDIA GeForce RTX 3070"],
  cloudType: "COMMUNITY",
  gpuCount: 1,
  ports: ["8888/http", "22/tcp"],
  supportPublicIp: true,
  volumeInGb: 20,
  containerDiskInGb: 50,
  hfDatasetRepoId: "",
  hfDatasetDownloadToken: "",
  hfUploadRepoId: "",
  hfUploadToken: "",
  hfSessionName: `voice_name_${day}-${month}-${year}`,
  hfCheckpointDownloadUrl: "",
  hfCheckpointName: "",
  hfCheckpointDownloadToken: "",
  maxEpochs: 6200,
  checkpointEpochs: 25,
  batchSize: 16,
  precision: "16",
  quality: "medium",
  keepLastK: 2,
  language: "bn",
  maxWorkers: 1,
};
