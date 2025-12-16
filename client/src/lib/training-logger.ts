/**
 * Training Session Logger Service
 *
 * Handles creating and managing training session log files.
 * Uses native Node.js fs for Next.js compatibility.
 */

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  TrainingSessionLog,
  CreateTrainingLogRequest,
} from "./training-types";

// Log schema version for future migrations
const LOG_SCHEMA_VERSION = "1.0.0";

// Get logs directory from env or use default
const getLogsDir = (): string => {
  return process.env.LOGS_DIR || "./logs";
};

/**
 * Ensure logs directory exists
 */
async function ensureLogsDir(): Promise<string> {
  const logsDir = getLogsDir();
  try {
    await fs.mkdir(logsDir, { recursive: true });
  } catch {
    // Directory might already exist
  }
  return logsDir;
}

/**
 * Generate a log file name for a session
 */
function getLogFileName(sessionId: string, timestamp: string): string {
  // Format: training-session-{sessionId}-{YYYYMMDD-HHMMSS}.log
  const dateStr = timestamp
    .replace(/[:\-]/g, "")
    .replace("T", "-")
    .slice(0, 15);
  return `training-session-${sessionId.slice(0, 8)}-${dateStr}.log`;
}

/**
 * Get the full path to a session's log file
 */
export async function getLogFilePath(
  sessionId: string
): Promise<string | null> {
  const logsDir = await ensureLogsDir();

  try {
    const files = await fs.readdir(logsDir);
    const sessionFile = files.find((f: string) =>
      f.startsWith(`training-session-${sessionId.slice(0, 8)}`)
    );
    if (sessionFile) {
      return path.join(logsDir, sessionFile);
    }
  } catch {
    // Directory might not exist yet
  }

  return null;
}

/**
 * Create a new training session log
 */
export async function createTrainingSessionLog(
  request: CreateTrainingLogRequest
): Promise<{ sessionId: string; logFilePath: string }> {
  const logsDir = await ensureLogsDir();
  const sessionId = randomUUID();
  const now = new Date().toISOString();

  const sessionLog: TrainingSessionLog = {
    sessionId,
    createdAt: now,
    version: LOG_SCHEMA_VERSION,

    user: {
      username: request.username,
      sessionStartedAt: now,
    },

    pod: {
      id: request.podId,
      name: request.podName,
      gpuType: request.pod.gpuType,
      gpuCount: request.pod.gpuCount,
      cloudType: request.pod.cloudType,
      costPerHr: request.pod.costPerHr,
      imageName: request.pod.imageName,
      volumeInGb: request.pod.volumeInGb,
      containerDiskInGb: request.pod.containerDiskInGb,
    },

    trainingType: request.trainingType,
    config: request.config,
  };

  const fileName = getLogFileName(sessionId, now);
  const logFilePath = path.join(logsDir, fileName);

  // Write log file as formatted JSON
  await fs.writeFile(logFilePath, JSON.stringify(sessionLog, null, 2), "utf-8");

  console.log(`[Training Log] Created: ${logFilePath}`);

  return { sessionId, logFilePath };
}

/**
 * Read a training session log
 */
export async function readTrainingSessionLog(
  sessionId: string
): Promise<TrainingSessionLog | null> {
  const logFilePath = await getLogFilePath(sessionId);

  if (!logFilePath) {
    return null;
  }

  try {
    const content = await fs.readFile(logFilePath, "utf-8");
    return JSON.parse(content) as TrainingSessionLog;
  } catch {
    return null;
  }
}

/**
 * Delete a local log file (called after successful S3 upload)
 */
export async function deleteLocalLog(sessionId: string): Promise<boolean> {
  const logFilePath = await getLogFilePath(sessionId);

  if (!logFilePath) {
    return false;
  }

  try {
    await fs.unlink(logFilePath);
    console.log(`[Training Log] Deleted local: ${logFilePath}`);
    return true;
  } catch (error) {
    console.error(`[Training Log] Failed to delete: ${logFilePath}`, error);
    return false;
  }
}
