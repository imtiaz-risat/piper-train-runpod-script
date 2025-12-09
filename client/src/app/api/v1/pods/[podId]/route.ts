import { NextRequest, NextResponse } from "next/server";

const RUNPOD_BASE_URL = "https://rest.runpod.io/v1";

interface RouteParams {
  params: Promise<{ podId: string }>;
}

/**
 * GET /api/v1/pods/[podId] - Get pod details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { podId } = await params;
    const apiKey = request.headers.get("x-runpod-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-runpod-api-key header" },
        { status: 401 }
      );
    }

    const response = await fetch(`${RUNPOD_BASE_URL}/pods/${podId}`, {
      method: "GET",
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
    console.error("Error fetching pod details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/pods/[podId] - Terminate pod
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { podId } = await params;
    const apiKey = request.headers.get("x-runpod-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-runpod-api-key header" },
        { status: 401 }
      );
    }

    const response = await fetch(`${RUNPOD_BASE_URL}/pods/${podId}`, {
      method: "DELETE",
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

    return NextResponse.json({
      success: true,
      message: `Pod ${podId} terminated successfully`,
    });
  } catch (error) {
    console.error("Error terminating pod:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
