import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.user.count();
  return NextResponse.json({ needsSetup: count === 0 });
}

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }
  const count = await prisma.user.count();
  if (count > 0) {
    return NextResponse.json({ error: "Admin account already exists" }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { username, password: hash } });
  return NextResponse.json({ success: true });
}
