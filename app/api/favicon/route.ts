import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

// Many crawlers and browsers request /favicon.ico directly. Serve the icon from /icons
// so that request never returns a 404 (which shows up as a console error and hurts SEO).
export async function GET() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), "icons", "favicon.ico"));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": "image/x-icon", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
