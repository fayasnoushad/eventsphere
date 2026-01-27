import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { CheckIn, ApiResponse } from "@/lib/types";
import { ObjectId } from "mongodb";

// POST /api/checkin - Check in a participant
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { participantId, eventId } = await req.json();

    if (!participantId || !eventId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
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

    // Check if participant exists and is approved
    const participants = await db.participants();
    const participant = await participants.findOne({ eventId, participantId });

    if (!participant) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Participant not found" },
        { status: 404 },
      );
    }

    if (participant.status !== "approved") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Participant not approved" },
        { status: 400 },
      );
    }

    // Check if already checked in
    const checkIns = await db.checkIns();
    const existing = await checkIns.findOne({ eventId, participantId });

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Already checked in" },
        { status: 400 },
      );
    }

    // Create check-in record
    const now = new Date();
    const checkIn: CheckIn = {
      eventId,
      participantId,
      checkedInBy: user.userId,
      checkedInAt: now,
    };

    await checkIns.insertOne(checkIn);

    // Update participant status
    await participants.updateOne(
      { eventId, participantId },
      {
        $set: {
          status: "checked-in",
          checkedInAt: now,
          checkedInBy: user.userId,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Check-in successful",
        data: { participant },
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
    console.error("Check-in error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/checkin - Remove check-in
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { participantId, eventId } = await req.json();

    if (!participantId || !eventId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
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

    // Remove check-in
    const checkIns = await db.checkIns();
    await checkIns.deleteOne({ eventId, participantId });

    // Update participant status back to approved
    const participants = await db.participants();
    await participants.updateOne(
      { eventId, participantId },
      {
        $set: {
          status: "approved",
          updatedAt: new Date(),
        },
        $unset: {
          checkedInAt: "",
          checkedInBy: "",
        },
      },
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Check-in removed successfully",
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
    console.error("Remove check-in error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
