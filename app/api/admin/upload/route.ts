import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "blog", resource_type: "image" },
        (err, data) => (err ? reject(err) : resolve(data!))
      ).end(buffer);
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed: " + (e as Error).message }, { status: 500 });
  }
}
