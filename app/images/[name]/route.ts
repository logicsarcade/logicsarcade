import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIRS, IMAGE_TYPES } from "@/lib/uploads";
import { readImage } from "@/lib/image-storage";

export const runtime = "nodejs";

// Serves uploaded images at [domain]/images/[image_name]
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safe = path.basename(name);
  const type = IMAGE_TYPES[path.extname(safe).toLowerCase()];
  if (!type || safe !== name) return new Response("Not found", { status: 404 });

  const headers = { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" };

  // 1) Supabase Storage (permanent)
  const stored = await readImage(safe);
  if (stored) return new Response(new Uint8Array(stored), { headers });

  // 2) Older images that still sit on the server disk
  for (const dir of UPLOAD_DIRS) {
    try {
      const data = await fs.readFile(path.join(dir, safe));
      return new Response(new Uint8Array(data), {
        headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
      });
    } catch { /* try next folder */ }
  }
  return new Response("Not found", { status: 404 });
}
