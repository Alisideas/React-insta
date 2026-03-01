import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug, published: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() });
}
