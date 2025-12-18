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
    const participants = await db.collection("pending").find({}).toArray();
    return Response.json({
      success: true,
      participants: participants,
    });
  } catch (e: any) {
    console.error(e.message);
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}
