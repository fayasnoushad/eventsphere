import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.id.toUpperCase();
  const password = process.env.PASSWORD;
  const savedPassword = body.password;

  if (!password || !savedPassword || password !== savedPassword)
    return Response.json(
      { success: false, error: "Password not match" },
      { status: 401 }
    );

  try {
    const client = await clientPromise;
    const db = client.db("texus");
    const found = await db.collection("checkin").findOne({ id });
    if (!found) {
      const registered = await db.collection("participants").findOne({ id });
      if (registered) await db.collection("checkin").insertOne({ id });
      else return Response.json({ success: false, error: "Not registered" });
    }
    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const id = body.id;

  const password = process.env.PASSWORD;
  const savedPassword = body.password;

  if (!password || !savedPassword || password !== savedPassword)
    return Response.json(
      { success: false, error: "Password not match" },
      { status: 401 }
    );

  try {
    const client = await clientPromise;
    const db = client.db("texus");
    await db.collection("checkin").deleteOne({ id });
    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}
