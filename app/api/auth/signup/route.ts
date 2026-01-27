import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { SignupFormData, ApiResponse, User } from "@/lib/types";
import { validateEmail, normalizePhone } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body: SignupFormData = await req.json();
    const { email, password, organizationName, contactPerson, phone } = body;

    // Validation
    if (!email || !password || !organizationName || !contactPerson || !phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const users = await db.users();
    const existingUser = await users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const now = new Date();

    const newUser: User = {
      email: email.toLowerCase(),
      password: hashedPassword,
      organizationName: organizationName.trim(),
      contactPerson: contactPerson.trim(),
      phone: normalizePhone(phone),
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Account created successfully. Please login.",
        data: { userId: result.insertedId.toString() },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
