import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, slug, excerpt, content, coverImage, published } = await req.json();
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: { title, slug, excerpt: excerpt ?? "", content, coverImage: coverImage ?? "", published: Boolean(published) },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
