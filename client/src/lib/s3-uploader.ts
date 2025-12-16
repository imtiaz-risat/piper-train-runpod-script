/**
 * S3 Upload Service
 *
 * Handles uploading training session logs to AWS S3 for archival.
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "fs";

// Simple console logger
const log = {
  info: (message: string, data?: object) =>
    console.log(`[S3] ${message}`, data ? JSON.stringify(data) : ""),
  error: (message: string, data?: object) =>
    console.error(`[S3 ERROR] ${message}`, data ? JSON.stringify(data) : ""),
};

// Lazy-initialized S3 client
let s3Client: S3Client | null = null;

/**
 * Get or create S3 client
 */
function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_REGION || "us-east-1";

    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3Client;
}

/**
 * Check if S3 is configured
 */
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET_NAME
  );
}

/**
 * Generate S3 key for a training log
 * Format: training-logs/{year}/{month}/{sessionId}.log
 */
function generateS3Key(sessionId: string, createdAt: string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `training-logs/${year}/${month}/${sessionId}.log`;
}

/**
 * Upload a training session log file to S3
 */
export async function uploadLogToS3(
  filePath: string,
  sessionId: string,
  createdAt: string
): Promise<{ bucket: string; key: string; url: string }> {
  const bucket = process.env.S3_BUCKET_NAME;

  if (!bucket) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  if (!isS3Configured()) {
    throw new Error("AWS credentials are not configured");
  }

  const client = getS3Client();
  const key = generateS3Key(sessionId, createdAt);

  try {
    // Read the log file
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
      ContentType: "application/json",
      Metadata: {
        sessionId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await client.send(command);

    const region = process.env.AWS_REGION || "us-east-1";
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    log.info("Uploaded log to S3", { sessionId, bucket, key, url });

    return { bucket, key, url };
  } catch (error) {
    log.error("Failed to upload log to S3", {
      sessionId,
      bucket,
      key,
      error: String(error),
    });
    throw error;
  }
}

/**
 * Get the S3 URL for a log file
 */
export function getS3Url(bucket: string, key: string): string {
  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
