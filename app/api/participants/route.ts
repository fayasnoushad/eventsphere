import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { ObjectId } from "mongodb";

// GET /api/participants?eventId=xxx - Get all participants for an event
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event ID is required" },
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

    // Get participants
    const participants = await db.participants();
    const participantList = await participants
      .find({ eventId })
      .sort({ registeredAt: -1 })
      .toArray();

    // Get check-in status
    const checkIns = await db.checkIns();
    const checkInList = await checkIns.find({ eventId }).toArray();
    const checkInMap = new Map(checkInList.map((c) => [c.ticketId, c]));

    const enrichedParticipants = participantList.map((p) => ({
      ...p,
      checkIn: checkInMap.get(p.ticketId),
    }));

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          participants: enrichedParticipants,
          total: participantList.length,
          checkedIn: checkInList.length,
        },
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
    console.error("Get participants error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
