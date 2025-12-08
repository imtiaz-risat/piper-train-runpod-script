# Implementation Guide: Piper Training GUI (React Client-Only)

This guide details how to build the Piper TTS Training system as a **static React application** that communicates directly with the **RunPod REST API**.

## 🚀 Core Architecture

- **Security First**: API Keys and HF Tokens are **NEVER** stored in `localStorage` or `cookies`. They are kept in React State (memory only) and must be re-entered (or pasted) for every session.
- **Direct API**: Browser sends HTTP requests to `https://rest.runpod.io/v1/pods`.
- **No Backend**: Logic for constructing the JSON payload lives entirely in the frontend.

## 1. Project Setup (Vite + React)

Initialize the project with TypeScript and SWC/Vite.

```bash
npm create vite@latest piper-gui-react -- --template react-ts
cd piper-gui-react
npm install lucide-react react-hook-form zod axios @hookform/resolvers clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2. Directory Structure

```text
/src
  /components
    /ui                (Buttons, Inputs, Cards - shadcn/ui style)
    /JobForm.tsx       (The main complex form)
    /APIKeyModal.tsx   (To prompt for keys if session is empty)
  /lib
    /api.ts            (RunPod REST Client)
    /types.ts          (Zod Schemas & Types)
    /constants.ts      (Default values)
  App.tsx
```

## 3. The RunPod REST Client (`/lib/api.ts`)

We implement the `createPod` function using the exact schema from `docs/runpod-api/create-a-pod.txt`.

```typescript
import axios from "axios";
import { JobConfig } from "./types";

const RUNPOD_BASE_URL = "https://rest.runpod.io/v1";

/**
 * Creates a Pod on RunPod using the REST API.
 * @param apiKey - The user's RunPod API Key (passed from memory)
 * @param config - The form data collected from the UI
 */
export async function createPod(apiKey: string, config: JobConfig) {
  // 1. Construct the Environment Variables Dictionary
  const envVars = {
    HF_DATASET_REPO_ID: config.datasetRepo,
    HF_DATASET_TOKEN: config.hfDatasetToken,
    HF_UPLOAD_REPO_ID: config.uploadRepo,
    HF_UPLOAD_TOKEN: config.hfUploadToken,
    HF_UPLOAD_SESSION_ID: config.sessionId,
    HF_CHECKPOINT_URL: config.checkpointUrl || "",
    HF_CHECKPOINT_NAME: config.checkpointName || "",
    MAX_EPOCHS: config.maxEpochs.toString(),
    BATCH_SIZE: config.batchSize.toString(),
    QUALITY: config.quality, // low, medium, high
    POD_NAME: config.podName,
    RUNPOD_API_KEY: apiKey, // Injected for auto-kill script
    // ... add any other vars from README.md
  };

  // 2. The Bootstrap Command (The Bash Script)
  // This must match exactly what is in the README but escaped for JSON
  const dockerArgs = [
    "bash",
    "-c",
    `set -ex; 
     apt-get update && apt-get install -y dos2unix jq; 
     curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/piper_train_runpod.sh -o train.sh;
     curl -sSL https://raw.githubusercontent.com/imtiaz-risat/piper-train-runpod-script/main/kill_pod.sh -o kill_pod.sh;
     dos2unix train.sh kill_pod.sh;
     chmod +x train.sh kill_pod.sh;
     bash train.sh;
     bash kill_pod.sh;
     sleep infinity`,
  ];

  // 3. Payload Construction (Based on OpenAPI Spec)
  const payload = {
    name: config.podName,
    imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04", // Verify this version
    gpuTypeId: "NVIDIA RTX A4000", // Or user selection
    cloudType: "SECURE",
    gpuCount: 1,
    volumeInGb: 50,
    containerDiskInGb: 50,
    minVcpuCount: 2,
    minMemoryInGb: 15,
    dockerStartCmd: dockerArgs, // Array of strings is safer than raw string
    env: envVars, // Object { KEY: "value" }
  };

  // 4. Send Request
  const response = await axios.post(`${RUNPOD_BASE_URL}/pods`, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
```

## 4. The Form Logic (Memory Only)

In `App.tsx`:

```typescript
function App() {
  const [apiKey, setApiKey] = useState<string>("");

  if (!apiKey) {
    return <APIKeyModal onSubmit={setApiKey} />;
  }

  return <JobForm apiKey={apiKey} />;
}
```

- `APIKeyModal` asks for the key.
- Once entered, it exists in `apiKey` state.
- If user refreshes, `apiKey` is gone (Security Feature).

## 5. Deployment (Nginx)

Since this is a client-side app, build it and serve strictly static.

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router (if used)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 6. Development Tips

1.  **CORS**: RunPod API supports CORS. If you hit issues locally, use a Vite proxy in `vite.config.ts`.
2.  **Testing**: Create a "Mock Mode" button that logs the JSON payload to console instead of sending it, so you can verify the `env` object without spending money.

```bash
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

payload = {
    "cloudType": "SECURE",
    "computeType": "GPU",
    "name": "api_ssh_pod",
    "imageName": "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
    "gpuCount": 1,
    "gpuTypeIds": ["NVIDIA A100 80GB PCIe"],
    "ports": ["22/tcp", "8888/http"],
    "supportPublicIp": True,
    "containerDiskInGb": 80,
    "volumeInGb": 20,
}

resp = requests.post(f"{API}/pods", json=payload, headers=H)

resp.raise_for_status()
data = resp.json()
pod_id = data["id"]
print(f"Pod Created Successfully! Pod ID: {pod_id}")

print("Starting the Pod...")
requests.post(f"{API}/pods/{pod_id}/start", headers=H)
print("Pod Started Successfully!")
```
