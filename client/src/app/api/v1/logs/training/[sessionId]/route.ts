/**
 * GET /api/v1/logs/training/[sessionId] - Get a training session log
 *
 * This endpoint is primarily for debugging/viewing local logs.
 * In production with S3 configured, logs are immediately uploaded and deleted locally.
 */

import { NextRequest, NextResponse } from "next/server";
import { readTrainingSessionLog } from "@/lib/training-logger";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * GET /api/v1/logs/training/[sessionId] - Get a training session log
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const log = await readTrainingSessionLog(sessionId);

    if (!log) {
      return NextResponse.json(
        {
          error:
            "Training session log not found (may have been uploaded to S3)",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("GET /api/v1/logs/training/[sessionId] - Exception:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve training log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
