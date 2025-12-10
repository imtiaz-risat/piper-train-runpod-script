import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login - Authenticate user
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Read credentials from environment variables
    const validUsername = process.env.AUTH_USERNAME;
    const validPassword = process.env.AUTH_PASSWORD;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({
        success: true,
        username: username,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
