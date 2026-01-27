import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { ObjectId } from "mongodb";

// POST /api/events/[id]/publish - Publish/unpublish event
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { status } = await req.json();

    if (!["draft", "published", "cancelled"].includes(status)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid status" },
        { status: 400 },
      );
    }

    const events = await db.events();
    const event = await events.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    // Check ownership
    if (event.organizerId !== user.userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    await events.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Event ${status} successfully`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Publish event error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
