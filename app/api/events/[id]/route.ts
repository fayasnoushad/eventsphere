import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { EventFormData, ApiResponse } from "@/lib/types";
import { ObjectId } from "mongodb";

// GET /api/events/[id] - Get single event by ID or slug (public for published, auth required for others)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const events = await db.events();

    // Try to find by ObjectId first, then by slug
    let event;
    if (ObjectId.isValid(id)) {
      event = await events.findOne({ _id: new ObjectId(id) });
    }

    if (!event) {
      event = await events.findOne({ slug: id });
    }

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    // If event is not published, require authentication and ownership
    if (event.status !== "published") {
      try {
        const user = await requireAuth();
        if (event.organizerId !== user.userId) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Unauthorized" },
            { status: 403 },
          );
        }
      } catch {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { event },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Get event error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/events/[id] - Update event (requires authentication and ownership)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body: Partial<EventFormData> = await req.json();

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

    // Build update object
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateFields.name = body.name.trim();
    if (body.description !== undefined)
      updateFields.description = body.description.trim();
    if (body.type !== undefined) updateFields.type = body.type;
    if (body.venue !== undefined) updateFields.venue = body.venue.trim();
    if (body.startDate !== undefined)
      updateFields.startDate = new Date(body.startDate);
    if (body.endDate !== undefined)
      updateFields.endDate = new Date(body.endDate);
    if (body.registrationDeadline !== undefined)
      updateFields.registrationDeadline = new Date(body.registrationDeadline);
    if (body.registrationFee !== undefined)
      updateFields.registrationFee = body.registrationFee;
    if (body.maxParticipants !== undefined)
      updateFields.maxParticipants = body.maxParticipants;
    if (body.requiresApproval !== undefined)
      updateFields.requiresApproval = body.requiresApproval;
    if (body.subEvents !== undefined) updateFields.subEvents = body.subEvents;
    if (body.contactEmail !== undefined)
      updateFields.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined)
      updateFields.contactPhone = body.contactPhone;
    if (body.guidelines !== undefined)
      updateFields.guidelines = body.guidelines;
    if (body.enableCertificates !== undefined)
      updateFields.enableCertificates = body.enableCertificates;
    if (body.enableMealPreferences !== undefined)
      updateFields.enableMealPreferences = body.enableMealPreferences;

    await events.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Event updated successfully",
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
    console.error("Update event error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/events/[id] - Delete event (requires authentication and ownership)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

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

    // Delete associated data
    const participants = await db.participants();
    const checkIns = await db.checkIns();

    await participants.deleteMany({ eventId: id });
    await checkIns.deleteMany({ eventId: id });
    await events.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Event deleted successfully",
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
    console.error("Delete event error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
