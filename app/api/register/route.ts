import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

function generateId(prefix = "TF", length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = prefix + "-";
  for (let i = 0; i < length; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = body.data;
  const password = process.env.PASSWORD;
  const savedPassword = body.password;
  if (!password || !savedPassword || password !== savedPassword)
    return Response.json(
      { success: false, error: "Password not match" },
      { status: 401 }
    );

  // Normalize and validate basic string fields
  const fieldsToStrip = ["name", "email", "phone", "college", "course"];
  for (const key of fieldsToStrip) {
    const value = data[key];
    data[key] = typeof value === "string" ? value.trim() : "";
  }

  // Uppercase selected fields safely
  const fieldsToUpper = ["name", "college", "course"];
  for (const key of fieldsToUpper) {
    const value = data[key];
    data[key] = typeof value === "string" ? value.toUpperCase() : "";
  }

  data.phone = String(data.phone ?? "").replace(/[^\d]/g, "");
  data.phone = data.phone.replace("+91", "");

  if (data.year < 10) data.year = 2026 - data.year;

  data.id = generateId();
  data.time = new Date();
  try {
    const client = await clientPromise;
    const db = client.db("texus");
    const found = await db
      .collection("participants")
      .findOne({ phone: data.phone });
    if (found) await db.collection("pending").insertOne(data);
    else await db.collection("participants").insertOne(data);
    return Response.json({ success: true, id: data.id });
  } catch (e: any) {
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}
