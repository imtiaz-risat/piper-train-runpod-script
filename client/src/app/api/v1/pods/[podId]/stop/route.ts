import { NextRequest, NextResponse } from "next/server";

const RUNPOD_BASE_URL = "https://rest.runpod.io/v1";

interface RouteParams {
  params: Promise<{ podId: string }>;
}

/**
 * POST /api/v1/pods/[podId]/stop - Stop a pod
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { podId } = await params;
    const apiKey = process.env.RUNPOD_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RUNPOD_API_KEY is not configured on server" },
        { status: 500 }
      );
    }

    const response = await fetch(`${RUNPOD_BASE_URL}/pods/${podId}/stop`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "RunPod API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error stopping pod:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
