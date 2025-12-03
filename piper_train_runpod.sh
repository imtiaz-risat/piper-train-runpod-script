set -euo pipefail

#############################################

### Environment variables ###

echo "Checking if required environment variables are set"
: "${HF_DATASET_REPO_ID:?ERROR: HF_DATASET_REPO_ID is not set in environment}"
# : "${HF_DATASET_TOKEN:?ERROR: HF_DATASET_TOKEN is not set in environment}"
: "${HF_UPLOAD_REPO_ID:?ERROR: HF_UPLOAD_REPO_ID is not set in environment}"
: "${HF_UPLOAD_TOKEN:?ERROR: HF_UPLOAD_TOKEN is not set in environment}"
: "${HF_UPLOAD_SESSION_ID:?ERROR: HF_UPLOAD_SESSION_ID is not set in environment}"
: "${HF_CHECKPOINT_NAME:?ERROR: HF_CHECKPOINT_NAME is not set in environment}"
: "${HF_CHECKPOINT_URL:?ERROR: HF_CHECKPOINT_URL is not set in environment}"
# : "${HF_CHECKPOINT_TOKEN:?ERROR: HF_CHECKPOINT_TOKEN is not set in environment}"
: "${MAX_EPOCHS:?ERROR: MAX_EPOCHS is not set in environment}"
: "${CHECKPOINT_EPOCHS:?ERROR: CHECKPOINT_EPOCHS is not set in environment}"
: "${BATCH_SIZE:?ERROR: BATCH_SIZE is not set in environment}"
: "${PRECISION:?ERROR: PRECISION is not set in environment}"
: "${QUALITY:?ERROR: QUALITY is not set in environment}"
: "${KEEP_LAST_K:?ERROR: KEEP_LAST_K is not set in environment}"

#############################################

WORKDIR="piper_train"
mkdir -p "$WORKDIR"
cd "$WORKDIR"
echo "WORKDIR: $PWD"

echo "=== Using container Python environment ==="
python --version || true
pip --version || true

echo "=== # Cloning the Piper fork ==="
if [ -d "piper-tts-fork" ]; then
  echo "piper-tts-fork already exists. Skipping clone."
else
  git clone https://github.com/imtiaz-risat/piper-tts-fork.git
fi
cd piper-tts-fork/src/python

##############################################

echo "=== Installing depdencies ==="
echo "Upgrading wheel, setuptool.."
pip install --upgrade wheel setuptools
echo "Installing numpy..."
pip install numpy==1.24.4
echo "Installing torchmetrics..."
pip install torchmetrics==0.11.4
echo "Installing six..."
pip install six
echo "Installing Cython..."
pip install cython
echo "Installing huggingface_hub..."
pip install huggingface_hub
echo "Installing Piper module..."
pip install -e .
echo "Building monotonic aligner..."
./build_monotonic_align.sh
echo "Monotonic aligner build complete."
echo "All dependencies installation complete."

echo "Setting up dataset directory..."
DATASET_DIR="$PWD/workspace/dataset"
TRAINING_DIR="$PWD/workspace/training"
mkdir -p "$DATASET_DIR" "$TRAINING_DIR"
echo "Dataset directory setup complete."

#######################################

echo "Downloading dataset from Hugging Face..."
python <<'PY'
from huggingface_hub import snapshot_download
import os

repo_id = os.environ.get("HF_DATASET_REPO_ID")
token = os.environ.get("HF_DATASET_TOKEN")

# Target directory where you want everything downloaded
target_dir = os.path.join(os.getcwd(), "workspace", "dataset")
os.makedirs(target_dir, exist_ok=True)

snapshot_download(
    repo_id=repo_id,
    token=token,
    repo_type="dataset",
    local_dir=target_dir
)
PY
echo "Dataset download complete."

########################################

echo "Preprocessing dataset..."
python -m piper_train.preprocess \
  --language bn \
  --input-dir "$DATASET_DIR" \
  --output-dir "$TRAINING_DIR" \
  --dataset-format ljspeech \
  --single-speaker \
  --sample-rate 22050 \
  --max-workers "${MAX_WORKERS:-4}"
echo "Preprocessing complete."

########################################

echo "=== Push config.json to Hugging Face ==="
export CONFIG_FILE_PATH="$TRAINING_DIR/config.json"

python <<'PY'
import os
from huggingface_hub import HfApi

repo_id = os.environ.get("HF_UPLOAD_REPO_ID")
token = os.environ.get("HF_UPLOAD_TOKEN")
repo_path = os.environ.get("HF_UPLOAD_SESSION_ID")
output_dir = os.path.join(os.getcwd(), "workspace", "training")
config_name = os.environ.get("CONFIG_FILE_PATH") or "config.json"
local_path = (
    os.path.join(output_dir, os.path.basename(config_name))
    if not os.path.isabs(config_name)
    else config_name
)
if repo_id and token and repo_path:
    api = HfApi(token=token)
    if os.path.exists(local_path):
        path_in_repo = f"{repo_path}/config.json"
        api.upload_file(
            path_or_fileobj=local_path,
            path_in_repo=path_in_repo,
            repo_id=repo_id,
            repo_type="model",
        )
        print(f"Uploaded {local_path} → {repo_id}:{path_in_repo}")
    else:
        print(f"Warning: {local_path} does not exist.")
else:
    print("Warning: missing HF_UPLOAD_REPO_ID, HF_UPLOAD_TOKEN or HF_UPLOAD_SESSION_ID")
PY

########################################

echo "Downloading checkpoint..."
if [ -n "${HF_CHECKPOINT_TOKEN:-}" ]; then
  # wget --header="Authorization: Bearer $HF_CHECKPOINT_TOKEN" -O "$TRAINING_DIR/$HF_CHECKPOINT_NAME" "$HF_CHECKPOINT_URL"
  curl -fL -H "Authorization: Bearer $HF_CHECKPOINT_TOKEN" -o "$TRAINING_DIR/$HF_CHECKPOINT_NAME" "$HF_CHECKPOINT_URL"
else
  # wget -O "$TRAINING_DIR/$HF_CHECKPOINT_NAME" "$HF_CHECKPOINT_URL"
  curl -fL -o "$TRAINING_DIR/$HF_CHECKPOINT_NAME" "$HF_CHECKPOINT_URL"
fi
echo "Checkpoint download complete."

########################################

echo "Training model..."
python -m piper_train \
    --dataset-dir "$TRAINING_DIR" \
    --accelerator gpu \
    --devices 1 \
    --batch-size "${BATCH_SIZE:-16}" \
    --validation-split 0.0 \
    --num-test-examples 0 \
    --max_epochs "${MAX_EPOCHS}" \
    --resume_from_checkpoint "$TRAINING_DIR/$HF_CHECKPOINT_NAME" \
    --checkpoint-epochs "${CHECKPOINT_EPOCHS:-10}" \
    --precision "${PRECISION:-16}" \
    --quality "${QUALITY}" \
    --keep-last-k "${KEEP_LAST_K:-5}" \
    --push-to-hf \
    --hf-repo-id "$HF_UPLOAD_REPO_ID" \
    --hf-token "$HF_UPLOAD_TOKEN" \
    --session-id "$HF_UPLOAD_SESSION_ID"
echo "Training complete."

########################################

echo "Exporting ONNX model..."
LATEST=$(ls -t "$TRAINING_DIR"/lightning_logs/version_*/checkpoints/*.ckpt 2>/dev/null | head -1 || true)

if [ -n "$LATEST" ]; then
  BASENAME="${LATEST##*/}"
  NAME="${BASENAME%.ckpt}"  # removes .ckpt
  ONNX_OUT="$TRAINING_DIR/$NAME.onnx"
  export ONNX_OUT
  python -m piper_train.export_onnx "$LATEST" "$ONNX_OUT"
  echo "ONNX model export complete."
else
  echo "Warning: no checkpoint found to export ONNX model."
fi

########################################

export ONNX_OUT_JSON="${TRAINING_DIR}/config.json"

echo "Uploading model to Hugging Face..."
python <<'PY'
import os
from huggingface_hub import HfApi

repo_id = os.environ.get("HF_UPLOAD_REPO_ID")
token = os.environ.get("HF_UPLOAD_TOKEN")

output_dir = os.path.join(os.getcwd(),"workspace","training")
onnx_path = os.environ.get("ONNX_OUT")
onnx_json_out = os.environ.get("ONNX_OUT_JSON")

to_upload = [onnx_path, onnx_json_out] if onnx_json_out else [onnx_path]

# Set the path inside the HF repo (folder you want)
repo_path = os.environ.get("HF_UPLOAD_SESSION_ID")

if repo_id and token:
    api = HfApi(token=token)

    for local_name in to_upload:
        # local file location
        local_path = (
            os.path.join(output_dir, os.path.basename(local_name))
            if not os.path.isabs(local_name)
            else local_name
        )

        if os.path.exists(local_path):
            # final path inside HF repo
            path_in_repo = f"{repo_path}/{os.path.basename(local_name)}"

            api.upload_file(
                path_or_fileobj=local_path,
                path_in_repo=path_in_repo,
                repo_id=repo_id,
                repo_type="model",
            )

            print(f"Uploaded {local_path} → {repo_id}/{path_in_repo}")
PY
echo "Uploading model to Hugging Face complete."

########################################

echo "===EXECUTION COMPLETED SUCCESSFULLY==="

########################################
