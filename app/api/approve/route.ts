import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
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
    await db.collection("participants").deleteMany({ phone: body.phone });
    const participant = await db
      .collection("pending")
      .findOne({ phone: body.phone });
    if (!participant)
      return Response.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      );
    await db.collection("participants").insertOne(participant);
    await db.collection("pending").deleteOne({ phone: body.phone });
    return Response.json({ success: true });
  } catch (e: any) {
    console.error(e.message);
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}
