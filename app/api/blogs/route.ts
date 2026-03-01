import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, content: true, createdAt: true, updatedAt: true, published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })));
}
