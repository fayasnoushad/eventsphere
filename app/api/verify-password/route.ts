import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = process.env.PASSWORD;
  const savedPassword = body.password;

  if (password && savedPassword && password === savedPassword)
    return Response.json({ success: true });
  else
    return Response.json(
      { success: false, error: "Password not match" },
      { status: 401 }
    );
}
