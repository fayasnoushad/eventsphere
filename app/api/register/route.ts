import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RegistrationFormData, Participant, ApiResponse } from "@/lib/types";
import { generateId, normalizePhone, validateEmail } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId: string = body.eventId;
    const data: RegistrationFormData = body.data;

    // Validation
    if (!eventId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event ID is required" },
        { status: 400 },
      );
    }

    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.college ||
      !data.course ||
      !data.year
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!validateEmail(data.email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Get event details
    const events = await db.events();
    const event = await events.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    if (event.status !== "published") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Event is not open for registration" },
        { status: 400 },
      );
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Registration deadline has passed" },
        { status: 400 },
      );
    }

    // Check blocked colleges
    const collegeLower = data.college.toLowerCase();
    if (
      event.blockedColleges?.some((blocked) =>
        collegeLower.includes(blocked.toLowerCase()),
      )
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Registrations from your college are not allowed for this event",
        },
        { status: 403 },
      );
    }

    // Normalize data
    const phone = normalizePhone(data.phone);
    const year =
      typeof data.year === "string" ? parseInt(data.year) : data.year;
    const finalYear = year < 100 ? year : year; // Already a year

    // Check for duplicate registration
    const participants = await db.participants();
    const existingParticipant = await participants.findOne({
      eventId,
      $or: [{ phone }, { email: data.email.toLowerCase() }],
    });

    if (existingParticipant) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You have already registered for this event" },
        { status: 409 },
      );
    }

    // Check max participants
    if (event.maxParticipants) {
      const currentCount = await participants.countDocuments({ eventId });
      if (currentCount >= event.maxParticipants) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Event has reached maximum capacity" },
          { status: 400 },
        );
      }
    }

    // Create participant
    const ticketId = generateId(event.slug.substring(0, 3).toUpperCase());
    const now = new Date();

    const participant: Participant = {
      eventId,
      ticketId,
      name: data.name.toUpperCase().trim(),
      email: data.email.toLowerCase().trim(),
      phone,
      college: data.college.toUpperCase().trim(),
      course: data.course.toUpperCase().trim(),
      year: finalYear,
      selectedSubEvents: data.selectedSubEvents || [],
      mealPreference: data.mealPreference,
      status: event.requiresApproval ? "pending" : "approved",
      paymentStatus: event.registrationFee > 0 ? "pending" : "paid",
      certificateGenerated: false,
      registeredAt: now,
      updatedAt: now,
    };

    await participants.insertOne(participant);

    // Update event registration count
    await events.updateOne(
      { _id: new ObjectId(eventId) },
      { $inc: { totalRegistrations: 1 } },
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Registration successful",
        data: {
          ticketId: participant.ticketId,
          status: participant.status,
          requiresPayment: event.registrationFee > 0,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
