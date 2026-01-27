import { EventData } from "./types";

export function generateId(prefix = "ES", length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = prefix + "-";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
}

export function normalizePhone(phone: string): string {
  return phone
    .replace(/\D/g, "")
    .replace(/^(\+91|91)/, "")
    .slice(-10);
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function isEventActive(event: EventData): boolean {
  const now = new Date();
  const regDeadline = new Date(event.registrationDeadline);
  return event.status === "published" && now <= regDeadline;
}

export function isEventOngoing(event: EventData): boolean {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  return now >= start && now <= end;
}

export function getEventStatus(event: EventData): {
  label: string;
  color: string;
} {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const regDeadline = new Date(event.registrationDeadline);

  if (event.status === "cancelled") {
    return { label: "Cancelled", color: "error" };
  }

  if (event.status === "draft") {
    return { label: "Draft", color: "neutral" };
  }

  if (now > end) {
    return { label: "Completed", color: "success" };
  }

  if (now >= start && now <= end) {
    return { label: "Ongoing", color: "warning" };
  }

  if (now > regDeadline) {
    return { label: "Registration Closed", color: "error" };
  }

  return { label: "Open for Registration", color: "success" };
}
