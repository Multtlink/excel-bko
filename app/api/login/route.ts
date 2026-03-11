import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { username, password } = parsed.data;

  console.log("ENV HASH:", process.env.APP_PASSWORD_HASH);
  console.log("PASSWORD RECEIVED:", password);

  if (username !== process.env.APP_USER) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, process.env.APP_PASSWORD_HASH!);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("session", "authenticated", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
