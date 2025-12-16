/**
 * POST /api/v1/logs/training - Create a new training session log and upload to S3
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createTrainingSessionLog,
  readTrainingSessionLog,
  deleteLocalLog,
} from "@/lib/training-logger";
import { uploadLogToS3, isS3Configured } from "@/lib/s3-uploader";
import type {
  CreateTrainingLogRequest,
  CreateTrainingLogResponse,
} from "@/lib/training-types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateTrainingLogRequest = await request.json();

    // Validate required fields
    if (!body.username || !body.podId || !body.trainingType || !body.config) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: username, podId, trainingType, config",
        },
        { status: 400 }
      );
    }

    // Create the training session log locally
    const { sessionId, logFilePath } = await createTrainingSessionLog(body);

    let s3Url: string | undefined;
    let s3Error: string | undefined;

    // Immediately try to upload to S3
    if (isS3Configured()) {
      try {
        const log = await readTrainingSessionLog(sessionId);
        if (log) {
          const result = await uploadLogToS3(
            logFilePath,
            sessionId,
            log.createdAt
          );
          s3Url = result.url;
          console.log(`[Training Log] Uploaded to S3: ${s3Url}`);

          // Delete local log after successful upload
          await deleteLocalLog(sessionId);
          console.log(`[Training Log] Deleted local log after S3 upload`);
        }
      } catch (uploadError) {
        // S3 upload failed - log but don't fail the request
        s3Error =
          uploadError instanceof Error ? uploadError.message : "Upload failed";
        console.warn(
          `[Training Log] S3 upload failed, keeping local log: ${s3Error}`
        );
      }
    } else {
      console.log(
        "[Training Log] S3 not configured, log saved locally only:",
        logFilePath
      );
    }

    const response: CreateTrainingLogResponse & {
      s3Url?: string;
      s3Error?: string;
    } = {
      success: true,
      sessionId,
      logFilePath: s3Url ? "(uploaded to S3)" : logFilePath,
      s3Url,
      s3Error,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/logs/training - Exception:", error);
    return NextResponse.json(
      {
        error: "Failed to create training log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
