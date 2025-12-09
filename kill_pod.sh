#!/usr/bin/env bash
set -ex

echo "Running kill_pod.sh..."

if [ -z "$RUNPOD_API_KEY" ]; then
  echo "ERROR: RUNPOD_API_KEY is missing."
  exit 1
fi

if [ -z "$POD_NAME" ]; then
  echo "ERROR: POD_NAME is missing."
  exit 1
fi

echo "Pod name: $POD_NAME"
echo "Killer API key: $RUNPOD_KILLER_API_KEY"
echo "RunPod API key: $RUNPOD_API_KEY"

# Find pod ID
pod_id=$(curl -sS "https://rest.runpod.io/v1/pods?name=$POD_NAME" \
  -H "Authorization: Bearer $RUNPOD_API_KEY" | jq -r '.[0].id')

echo "Found pod_id: $pod_id"

if [ -z "$pod_id" ] || [ "$pod_id" = "null" ]; then
  echo "ERROR: Could not resolve pod ID."
  exit 1
fi

# Try deletion 5 times
for i in {1..5}; do
  echo "Attempt $i: Deleting pod $pod_id ..."
  if curl --fail -sS -X DELETE "https://rest.runpod.io/v1/pods/$pod_id" \
      -H "Authorization: Bearer $RUNPOD_API_KEY"; then
      echo "Pod deletion succeeded."
      exit 0
  fi
  sleep 5
done

echo "Failed to delete pod after 5 retries."
exit 1
