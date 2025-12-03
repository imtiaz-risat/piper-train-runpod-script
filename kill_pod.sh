#!/usr/bin/env bash
set -ex

echo "Running kill_pod.sh..."

if [ -z "$RUNPOD_API_KEY" ]; then
  echo "ERROR: RUNPOD_API_KEY is missing."
  exit 0
fi

if [ -z "$POD_NAME" ]; then
  echo "ERROR: POD_NAME is missing."
  exit 0
fi

# Find pod ID
pod_id=$(curl -sS "https://rest.runpod.io/v1/pods?name=$POD_NAME" \
  -H "Authorization: Bearer $RUNPOD_API_KEY" | jq -r '.[0].id')

echo "Found pod_id: $pod_id"

if [ -z "$pod_id" ] || [ "$pod_id" = "null" ]; then
  echo "ERROR: Could not resolve pod ID."
  exit 0
fi

# Try deletion 5 times
for i in {1..5}; do
  echo "Attempt $i: Deleting pod $pod_id ..."
  curl --fail -sS -X DELETE "https://rest.runpod.io/v1/pods/$pod_id" \
    -H "Authorization: Bearer $RUNPOD_API_KEY" && {
      echo "Pod deletion succeeded."
      exit 0
    }
  sleep 5
done

echo "Failed to delete pod after 5 retries."
exit 0
