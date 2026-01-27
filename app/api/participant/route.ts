import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

// POST /api/participant - Look up participant by ID or phone (public for ticket verification)
export async function POST(req: NextRequest) {
  try {
    const { participantId, phone, eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event ID is required" },
        { status: 400 },
      );
    }

    if (!participantId && !phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Participant ID or phone is required" },
        { status: 400 },
      );
    }

    const participants = await db.participants();
    const query: any = { eventId };

    if (participantId) {
      query.participantId = participantId.toUpperCase();
    } else if (phone) {
      query.phone = phone.replace(/\D/g, "").slice(-10);
    }

    const participant = await participants.findOne(query);

    if (!participant) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Participant not found" },
        { status: 404 },
      );
    }

    // Get check-in status
    const checkIns = await db.checkIns();
    const checkIn = await checkIns.findOne({
      eventId,
      participantId: participant.participantId,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          participant,
          checkIn,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Participant lookup error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
