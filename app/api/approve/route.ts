import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { ObjectId } from "mongodb";

// POST /api/approve - Approve or reject participant
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { ticketId, eventId, action } = await req.json();

    if (!ticketId || !eventId || !action) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    // Verify event ownership
    const events = await db.events();
    const event = await events.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    if (event.organizerId !== user.userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Update participant status
    const participants = await db.participants();
    const result = await participants.updateOne(
      { eventId, ticketId },
      {
        $set: {
          status: action === "approve" ? "approved" : "rejected",
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Participant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Participant ${action}d successfully`,
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
    console.error("Approve error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
