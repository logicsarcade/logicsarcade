import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/app/admin/actions";
import { IMAGE_TYPES } from "@/lib/uploads";
import { saveImage } from "@/lib/image-storage";
import { cleanupOrphanImages, deleteImageIfUnused } from "@/lib/uploads-cleanup";

export const runtime = "nodejs";
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  if (!IMAGE_TYPES[ext]) return NextResponse.json({ error: "Only JPG, PNG, GIF, WEBP or AVIF images are allowed." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image must be under 8 MB." }, { status: 400 });

  const base = path.basename(file.name, ext).toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";

  await cleanupOrphanImages();
  let name: string;
  try {
    name = await saveImage(base, ext, Buffer.from(await file.arrayBuffer()), IMAGE_TYPES[ext]);
  } catch (e) {
    return NextResponse.json({ error: `Upload failed: ${(e as Error).message}` }, { status: 500 });
  }
  return NextResponse.json({ url: `/images/${name}` });
}

// Remove an uploaded image that was never saved with a blog
export async function DELETE(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await req.json().catch(() => ({ url: "" }));
  await deleteImageIfUnused(String(url || ""));
  return NextResponse.json({ ok: true });
}
