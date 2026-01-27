import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { LoginFormData, ApiResponse, UserSession } from "@/lib/types";
import { validateEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body: LoginFormData = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Find user
    const users = await db.users();
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create session
    const session: UserSession = {
      userId: user._id!.toString(),
      email: user.email,
      organizationName: user.organizationName,
    };

    await setAuthCookie(session);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            email: user.email,
            organizationName: user.organizationName,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
