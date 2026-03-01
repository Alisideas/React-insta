import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "change-me-in-production");

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
