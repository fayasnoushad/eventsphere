import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { user },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
