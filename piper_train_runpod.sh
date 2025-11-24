set -euo pipefail

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

echo "=== Installing depdencies ==="
echo "Upgrading wheel, setuptool.."
pip install --upgrade wheel setuptools
echo "Detecting Python version for numpy..."
PY_VER=$(python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' || echo "3.10")
case "$PY_VER" in
  3.12*) NUMPY_VERSION="1.26.4" ;;
  *) NUMPY_VERSION="1.24.4" ;;
esac
echo "Installing numpy ${NUMPY_VERSION}..."
pip install "numpy==${NUMPY_VERSION}"
echo "Installing torchmetrics..."
pip install torchmetrics==0.11.4
echo "Installing six..."
pip install six
echo "Installing Cython..."
pip install cython
echo "Installing Piper module..."
pip install -e .
echo "Building monotonic aligner..."
./build_monotonic_align.sh
echo "Monotonic aligner build complete."
echo "Installing huggingface_hub..."
pip install huggingface_hub
echo "All dependencies installation complete."

echo "Setting up dataset directory..."
TARGET_DIR="$PWD/workspace/dataset"
OUTPUT_DIR="$PWD/workspace/training"
mkdir -p "$TARGET_DIR" "$OUTPUT_DIR"
echo "Dataset directory setup complete."

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

echo "Preprocessing dataset..."
python -m piper_train.preprocess \
  --language bn \
  --input-dir "$TARGET_DIR" \
  --output-dir "$OUTPUT_DIR" \
  --dataset-format ljspeech \
  --single-speaker \
  --sample-rate 22050 \
  --max-workers "${MAX_WORKERS:-4}"
echo "Preprocessing complete."

echo "Downloading checkpoint..."
CHECKPOINT_NAME="${HF_CHECKPOINT_NAME}"
CHECKPOINT_URL="${HF_CHECKPOINT_URL}"
if [ -n "${HF_CHECKPOINT_TOKEN:-}" ]; then
  wget --header="Authorization: Bearer $HF_CHECKPOINT_TOKEN" -O "$OUTPUT_DIR/$CHECKPOINT_NAME" "$CHECKPOINT_URL"
else
  wget -O "$OUTPUT_DIR/$CHECKPOINT_NAME" "$CHECKPOINT_URL"
fi
echo "Checkpoint download complete."

echo "Training model..."
python -m piper_train \
    --dataset-dir "$OUTPUT_DIR" \
    --accelerator gpu \
    --devices 1 \
    --batch-size "${BATCH_SIZE:-16}" \
    --validation-split 0.0 \
    --num-test-examples 0 \
    --max_epochs "${MAX_EPOCHS}" \
    --resume_from_checkpoint "$OUTPUT_DIR/$CHECKPOINT_NAME" \
    --checkpoint-epochs "${CHECKPOINT_EPOCHS:-10}" \
    --precision "${PRECISION:-16}" \
    --quality "${QUALITY}" \
    --push-to-hf \
    --hf-repo-id "$HF_UPLOAD_REPO_ID" \
    --hf-token "$HF_UPLOAD_TOKEN" \
    --session-id "${HF_UPLOAD_SESSION_ID:-${SESSION_ID:-}}"
echo "Training complete."

echo "Exporting ONNX model..."
LATEST=$(ls -t "$OUTPUT_DIR"/lightning_logs/version_*/checkpoints/*.ckpt 2>/dev/null | head -1 || true)
if [ -n "$LATEST" ]; then
  ONNX_OUT="$OUTPUT_DIR/${LATEST##*/}.onnx"
  export ONNX_OUT
  python -m piper_train.export_onnx "$LATEST" "$ONNX_OUT"
fi
echo "ONNX model export complete."

echo "Uploading model to Hugging Face..."
python <<'PY'
import os
from huggingface_hub import HfApi
repo_id=os.environ.get("HF_UPLOAD_REPO_ID")
token=os.environ.get("HF_UPLOAD_TOKEN")
output_dir=os.path.join(os.getcwd(),"workspace","training")
onnx_path=os.environ.get("ONNX_OUT")
to_upload=[onnx_path] if onnx_path else []
if repo_id and token:
    api=HfApi()
    for name in to_upload:
        path=os.path.join(output_dir, os.path.basename(name)) if not os.path.isabs(name) else name
        if os.path.exists(path):
            api.upload_file(path_or_fileobj=path, path_in_repo=name, repo_id=repo_id, token=token)
        else:
            print(f"Warning: {path} does not exist.")
else:
    print("Warning: HF_UPLOAD_REPO_ID and/or HF_UPLOAD_TOKEN not set.")
PY
echo "Uploading model to Hugging Face complete."



echo "Skipping base ONNX upload."
