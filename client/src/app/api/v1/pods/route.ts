import { NextRequest, NextResponse } from "next/server";

const RUNPOD_BASE_URL = "https://rest.runpod.io/v1";

/**
 * GET /api/v1/pods - List all pods
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-runpod-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-runpod-api-key header" },
        { status: 401 }
      );
    }

    const response = await fetch(`${RUNPOD_BASE_URL}/pods`, {
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
    return NextResponse.json({ pods: Array.isArray(data) ? data : [] });
  } catch (error) {
    console.error("Error fetching pods:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/pods - Create a new pod
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-runpod-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-runpod-api-key header" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${RUNPOD_BASE_URL}/pods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    console.error("Error creating pod:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
