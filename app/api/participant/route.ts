import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  let phone = body.phone;
  let id = body.id;
  if (id) id = "TF-" + id.toUpperCase();

  try {
    const client = await clientPromise;
    const db = client.db("texus");
    const participant = await db
      .collection("participants")
      .findOne(phone ? { phone } : { id });
    if (participant) {
      const checkedIn = await db
        .collection("checkin")
        .findOne({ id: participant.id });
      if (checkedIn)
        return Response.json({
          success: true,
          participant,
        });
    }
    return Response.json({
      success: false,
      error: "Not found",
    });
  } catch (e: any) {
    console.error(e.message);
    return Response.json(
      { success: false, error: e.message || "Something wrong" },
      { status: 500 }
    );
  }
}
