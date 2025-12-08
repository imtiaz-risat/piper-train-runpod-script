export const GPU_TYPES = [
  { id: "NVIDIA A100 80GB PCIe", label: "A100 PCIe" },
  { id: "NVIDIA A40", label: "A40" },
];

export const CLOUD_TYPES = [{ id: "SECURE", label: "Secure Cloud (Premium)" }];

export const QUALITY_OPTIONS = [
  { value: "medium", label: "Medium (Balanced)" },
  { value: "high", label: "High (Best quality)" },
];

export const PRECISION_OPTIONS = [
  { value: "16", label: "16-bit (Recommended)" },
];

export const LANGUAGES = [
  { code: "bn", name: "Bengali" },
  { code: "ne", name: "Nepali" },
];

export const POD_PAYLOAD_TEMPLATE = {
  cloudType: "SECURE",
  computeType: "GPU",
  name: "api_ssh_pod",
  imageName: "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
  gpuCount: 1,
  gpuTypeIds: ["NVIDIA A100 80GB PCIe"],
  ports: ["22/tcp", "8888/http"],
  supportPublicIp: true,
  containerDiskInGb: 80,
  volumeInGb: 20,
};

export const CONTAINER_START_COMMAND = `bash -c "set -ex
apt-get update && apt-get install -y dos2unix jq

# Download scripts
curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/piper_train_runpod.sh -o train.sh
curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/kill_pod.sh -o kill_pod.sh

# Normalize + make executable
dos2unix train.sh kill_pod.sh
chmod +x train.sh kill_pod.sh

# Run training
bash train.sh

# Run cleanup (self-delete)
bash kill_pod.sh

sleep infinity"
`;

export const DEFAULT_JOB_CONFIG = {
  podName: `piper-train-${Date.now()}`,
  gpuTypeId: "NVIDIA A100 80GB PCIe",
  cloudType: "SECURE",
  gpuCount: 1,
  volumeInGb: 20,
  containerDiskInGb: 80,
  datasetRepo: "",
  hfDatasetToken: "",
  uploadRepo: "",
  hfUploadToken: "",
  sessionId: `session-${Date.now()}`,
  checkpointUrl: "",
  checkpointName: "",
  checkpointToken: "",
  maxEpochs: 50,
  checkpointEpochs: 5,
  batchSize: 16,
  precision: "16" as const,
  quality: "medium" as const,
  keepLastK: 5,
  language: "bn",
  maxWorkers: 4,
};
