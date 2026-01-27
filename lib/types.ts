import { ObjectId } from "mongodb";

// User/Organizer Types
export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  organizationName: string;
  contactPerson: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  userId: string;
  email: string;
  organizationName: string;
}

// Event Types
export type EventType =
  | "tech-fest"
  | "hackathon"
  | "workshop"
  | "seminar"
  | "competition";
export type EventStatus =
  | "draft"
  | "published"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Coordinator {
  name: string;
  phone: string;
  role: "student" | "faculty";
}

export interface Prize {
  first: number;
  second: number;
  third?: number;
}

export interface EventSubEvent {
  name: string;
  description: string;
  rules: string[];
  prize?: Prize;
  coordinators: Coordinator[];
  maxParticipants?: number;
  registrationFee?: number;
  startTime?: Date;
  endTime?: Date;
}

export interface EventData {
  _id?: ObjectId;
  organizerId: string; // User ID who created this event
  organizationName: string;
  name: string;
  slug: string; // URL-friendly name
  description: string;
  type: EventType;
  status: EventStatus;
  banner?: string;
  logo?: string;

  // Event details
  venue: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;

  // Registration settings
  registrationFee: number;
  maxParticipants?: number;
  requiresApproval: boolean;

  // Sub-events (competitions, workshops, etc.)
  subEvents: EventSubEvent[];

  // Contact & Guidelines
  contactEmail: string;
  contactPhone: string;
  guidelines: string[];

  // Settings
  enableCertificates: boolean;
  enableMealPreferences: boolean;
  allowedColleges?: string[]; // Empty = all colleges allowed
  blockedColleges?: string[]; // Colleges not allowed

  // Meta
  createdAt: Date;
  updatedAt: Date;
  totalRegistrations: number;
}

// Participant Types
export interface Participant {
  _id?: ObjectId;
  eventId: string;
  ticketId: string; // Generated unique ID (e.g., "TF-ABC123")

  // Personal info
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: number;

  // Event-specific
  selectedSubEvents: string[]; // Names of sub-events they're participating in
  mealPreference?: "veg" | "non-veg";

  // Status
  status: "pending" | "approved" | "rejected" | "checked-in";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentId?: string;

  // Check-in
  checkedInAt?: Date;
  checkedInBy?: string;

  // Certificate
  certificateGenerated: boolean;
  certificateUrl?: string;

  // Meta
  registeredAt: Date;
  updatedAt: Date;
}

// Check-in Types
export interface CheckIn {
  _id?: ObjectId;
  eventId: string;
  ticketId: string;
  checkedInBy: string; // Admin/organizer who checked them in
  checkedInAt: Date;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Data Types
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string | number;
  selectedSubEvents: string[];
  mealPreference?: "veg" | "non-veg";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  organizationName: string;
  contactPerson: string;
  phone: string;
}

export interface EventFormData {
  name: string;
  description: string;
  type: EventType;
  venue: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  registrationFee: number;
  maxParticipants?: number;
  requiresApproval: boolean;
  contactEmail: string;
  contactPhone: string;
  guidelines: string[];
  subEvents: EventSubEvent[];
  enableCertificates: boolean;
  enableMealPreferences: boolean;
}
