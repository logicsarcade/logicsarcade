import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/app/admin/actions";
import { UPLOAD_DIR, IMAGE_TYPES } from "@/lib/uploads";
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
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  let name = `${base}${ext}`;
  let i = 1;
  while (await fs.stat(path.join(UPLOAD_DIR, name)).then(() => true, () => false)) {
    name = `${base}-${i++}${ext}`;
  }

  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
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
