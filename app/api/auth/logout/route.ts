import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    await removeAuthCookie();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
