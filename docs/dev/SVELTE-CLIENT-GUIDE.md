# Implementation Guide: Piper Training GUI (Svelte Client-Only)

This guide details how to build the Piper TTS Training system using **Svelte** (v4/v5) and the **RunPod REST API**. Svelte is recommended for its highly efficient handling of complex forms.

## 🚀 Core Architecture

- **Stateless Secrets**: We create a `SessionStore` that lives only in memory. When the tab closes, the keys are gone.
- **Form Power**: We bind the massive configuration object (Datasets, Epochs, Batch Sizes) directly to the DOM without boilerplate.
- **Direct REST**: Uses `fetch` to POST to `https://rest.runpod.io/v1/pods`.

## 1. Project Setup

Initialize basic Svelte + Vite + TypeScript.

```bash
npm create vite@latest piper-gui-svelte -- --template svelte-ts
cd piper-gui-svelte
npm install
```

## 2. State Management (`lib/session.ts`)

Instead of `localStorage`, we use a writable store that initializes to empty strings.

```typescript
import { writable } from "svelte/store";

export interface SessionSecrets {
  runpodApiKey: string;
  hfDatasetToken: string;
  hfUploadToken: string;
}

// Resets on every refresh
export const secrets = writable<SessionSecrets>({
  runpodApiKey: "",
  hfDatasetToken: "",
  hfUploadToken: "",
});
```

## 3. The Config Component (`components/JobConfig.svelte`)

Svelte makes big forms easy.

```svelte
<script lang="ts">
  import { secrets } from '../lib/session';

  // State object for non-secret config
  let config = {
    datasetRepo: "",
    uploadRepo: "",
    sessionId: "run-01",
    epochs: 50,
    batchSize: 16,
    podName: `piper-train-${Date.now()}`
  };
</script>

<div class="form-group">
  <h3>Secrets (Not Saved)</h3>
  <input type="password" placeholder="RunPod API Key" bind:value={$secrets.runpodApiKey} />
  <input type="password" placeholder="HF Read Token" bind:value={$secrets.hfDatasetToken} />
  <input type="password" placeholder="HF Write Token" bind:value={$secrets.hfUploadToken} />
</div>

<div class="form-group">
  <h3>Dataset Config</h3>
  <input placeholder="user/dataset-repo" bind:value={config.datasetRepo} />
  <!-- ... etc ... -->
</div>
```

## 4. The Deployment Logic (`lib/runpod.ts`)

```typescript
export async function deployPod(secrets: SessionSecrets, config: JobConfig) {
  const url = "https://rest.runpod.io/v1/pods";

  // 1. Prepare Docker Args (The Bash Script)
  const dockerStartCmd = [
    "bash",
    "-c",
    `set -ex;
     # ... copy the script from README ...
     bash train.sh; bash kill_pod.sh`,
  ];

  // 2. Prepare Payload
  const body = {
    name: config.podName,
    cloudType: "SECURE",
    gpuTypeId: "NVIDIA RTX A4000",
    gpuCount: 1,
    volumeInGb: 50,
    containerDiskInGb: 50,
    dockerStartCmd: dockerStartCmd,
    env: {
      HF_DATASET_REPO_ID: config.datasetRepo,
      HF_DATASET_TOKEN: secrets.hfDatasetToken,
      // ... map all other variables
      RUNPOD_API_KEY: secrets.runpodApiKey,
    },
  };

  // 3. Send
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secrets.runpodApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

## 5. View Logic

- **Step 1**: User opens page.
- **Step 2**: Fills out "Secrets" section (Top of form).
- **Step 3**: Fills out "Training Config".
- **Step 4**: Clicks "Start Training".
- **Step 5**: App shows loading spinner -> Success Message with Pod ID.
- **Security**: Since `$secrets` is just a JS variable, it disappears on close.

## 6. Styling

Use a simple class-less CSS framework like `Pico.css` or write basic CSS in `<style>` blocks for a "Raw" but functional look, or create a `global.css` with Tailwind if preferred.
