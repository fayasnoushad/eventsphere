import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { EventData, EventFormData, ApiResponse } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";

// GET /api/events - List all published events (public) or user's events (authenticated)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const myEvents = searchParams.get("myEvents") === "true";

    const events = await db.events();
    let query: any = {};

    // If requesting own events, require authentication
    if (myEvents) {
      const user = await requireAuth();
      query.organizerId = user.userId;
    } else if (organizerId) {
      query.organizerId = organizerId;
    }

    if (status && (myEvents || organizerId)) query.status = status;
    if (type) query.type = type;

    // Debug logging
    console.log("Query:", query);
    const totalEvents = await events.countDocuments({});
    console.log("Total events in DB:", totalEvents);

    const eventList = await events
      .find(query)
      .sort({ startDate: -1 })
      .toArray();

    console.log("Filtered events:", eventList.length);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { events: eventList },
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
    console.error("Get events error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/events - Create new event (requires authentication)
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body: EventFormData = await req.json();

    // Validation
    if (!body.name || !body.description || !body.type || !body.venue) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const events = await db.events();
    const slug = generateSlug(body.name);

    // Check if slug already exists for this organizer
    const existingEvent = await events.findOne({
      organizerId: user.userId,
      slug,
    });

    if (existingEvent) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "An event with this name already exists" },
        { status: 409 },
      );
    }

    const now = new Date();
    const newEvent: EventData = {
      organizerId: user.userId,
      organizationName: user.organizationName,
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      type: body.type,
      status: "published",
      venue: body.venue.trim(),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      registrationDeadline: new Date(body.registrationDeadline),
      registrationFee: body.registrationFee || 0,
      maxParticipants: body.maxParticipants,
      requiresApproval: body.requiresApproval || false,
      upiId: body.upiId?.trim() || "",
      subEvents: body.subEvents || [],
      contactEmail: body.contactEmail || user.email,
      contactPhone: body.contactPhone || "",
      guidelines: body.guidelines || [],
      enableCertificates: body.enableCertificates || false,
      enableMealPreferences: body.enableMealPreferences || false,
      createdAt: now,
      updatedAt: now,
      totalRegistrations: 0,
    };

    const result = await events.insertOne(newEvent);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Event created successfully",
        data: { eventId: result.insertedId.toString(), slug },
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Create event error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
