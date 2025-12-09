# Piper TTS Training on RunPod (with Auto Pod Termination)

This guide explains how to run your **Piper TTS training pipeline** on RunPod, including an **optional auto-termination feature** where the pod deletes itself after training completes.

This is useful when running **batch training jobs** to avoid wasting GPU-hours after the model finishes training.

---

# Features

- ✔ Fully automated Piper training
- ✔ Automatic checkpoint uploads to HuggingFace
- ✔ Optional resume-from-checkpoint support
- ✔ Automatic pod deletion using RunPod API (optional)
- ✔ Clean and simple container start command
- ✔ Environment-variable based configuration

---

# Overview of Training Flow

1. You create a RunPod **pod with a custom name**
2. You override the **Container Start Command**
3. You pass environment variables containing dataset paths, HF tokens, training settings, etc.
4. The pod:

   - Downloads training script (`piper_train_runpod.sh`)
   - Downloads pod kill script (`kill_pod.sh`)
   - Runs training
   - (Optional) Deletes itself using the RunPod API

5. Checkpoints are uploaded to your HuggingFace repository

---

# 1. Create a Pod with a Specific Name

When creating your pod in RunPod:

- Choose any GPU template you like
- **Set a custom Pod Name**, e.g.

```
piper_training_bn_312424
```

You'll pass this into the environment as `POD_NAME`.

This name is required for the auto-kill script to find the pod ID via RunPod’s REST API.

---

# 2. Override the Container Start Command

Open your Pod Template → **Container Start Command**, and paste the following:

```bash
bash -c "
set -ex

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

sleep infinity
"
```

### Important

- If you **want the pod to delete itself** after training → keep `bash kill_pod.sh`
- If you **want to keep the pod alive** after training → **remove/comment the kill script call**

Example (keep pod alive):

```bash
# bash kill_pod.sh
```

---

# 🔧 3. Set Environment Variables

In the **Pod Template → Edit → Environment Variables** section, add these:

| Variable               | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `HF_DATASET_REPO_ID`   | HuggingFace repo containing your training dataset  |
| `HF_DATASET_TOKEN`     | HF token with **read** access                      |
| `HF_UPLOAD_REPO_ID`    | HF repo where checkpoints will be uploaded         |
| `HF_UPLOAD_TOKEN`      | HF token with **write** access                     |
| `HF_UPLOAD_SESSION_ID` | A folder name to group checkpoints inside the repo |
| `HF_CHECKPOINT_URL`    | URL to a resume checkpoint `.ckpt`                 |
| `HF_CHECKPOINT_NAME`   | File name of the resume checkpoint                 |
| `HF_CHECKPOINT_TOKEN`  | HF token to read checkpoint                        |
| `MAX_EPOCHS`           | Total epochs to train                              |
| `CHECKPOINT_EPOCHS`    | Save checkpoint every N epochs; Default: `10`      |
| `BATCH_SIZE`           | Default: `16`                                      |
| `PRECISION`            | Default: `16`                                      |
| `QUALITY`              | `low`, `medium`, or `high`; Default: `medium`      |
| `KEEP_LAST_K`          | Keep only last K checkpoints locally/in the pod    |
| `RUNPOD_API_KEY`       | (Required for auto-kill) Your RunPod API key       |
| `POD_NAME`             | The exact name of the pod you created              |
| `LANGUAGE`             | Language code for training                         |

Example:

```
HF_DATASET_REPO_ID="myuser/piper-bn-dataset"
HF_DATASET_TOKEN="hf_XXXXXXXXXXXXXXXXXXXX"
HF_UPLOAD_REPO_ID="myuser/piper-ck"
HF_UPLOAD_TOKEN="hf_YYYYYYYYYYYYYYYYYYYY"
HF_UPLOAD_SESSION_ID="run-01"
HF_CHECKPOINT_URL="https://huggingface.co/myuser/piper-ck/resolve/main/epoch=xxxx-step=xxxx.ckpt"
HF_CHECKPOINT_NAME="epoch=xxxx-step=xxxx.ckpt"
HF_CHECKPOINT_TOKEN="hf_YYYYYYYYYYYYYYYYYYYY"
MAX_EPOCHS="50"
CHECKPOINT_EPOCHS="5"
BATCH_SIZE="16"
PRECISION="16"
QUALITY="medium"
KEEP_LAST_K="5"
RUNPOD_API_KEY="rp_XXXXXXXXXXXXXXXX"
POD_NAME="api_pod_123456789012"
LANGUAGE="bn"
```

---

# ▶️ 4. Start the Pod

Simply click **Deploy**.

Inside the pod:

- The training script downloads the dataset from HF
- Piper finetuning begins
- Checkpoints are periodically saved to HF
- After completion, the kill script attempts to delete the pod using:

  ```
  DELETE https://rest.runpod.io/v1/pods/{pod_id}
  ```

---

# 💀 Auto Pod Termination (How it works)

`kill_pod.sh`:

1. Finds your pod by name
2. Extracts the pod ID using the RunPod REST API
3. Tries to delete the pod up to 5 times
4. If deletion succeeds → the container stops instantly
5. If deletion fails → script exits normally and pod stays alive

---

# 📦 Where to Find Your Checkpoints

After training:

- Checkpoints are uploaded to the HF repo you set via:

```
HF_UPLOAD_REPO_ID
HF_UPLOAD_SESSION_ID
```

Example final path:

```
myuser/piper-checkpoints/run-01/epoch_005.ckpt
```

---
