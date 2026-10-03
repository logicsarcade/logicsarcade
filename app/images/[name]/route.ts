import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR, IMAGE_TYPES } from "@/lib/uploads";

export const runtime = "nodejs";

// Serves uploaded images at [domain]/images/[image_name]
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safe = path.basename(name);
  const type = IMAGE_TYPES[path.extname(safe).toLowerCase()];
  if (!type || safe !== name) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, safe));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
