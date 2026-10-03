import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { UPLOAD_DIR } from "@/lib/uploads";

const GRACE_MS = 30 * 60 * 1000; // don't touch files uploaded in the last 30 min (editor may still be open)

async function usedImages(): Promise<Set<string>> {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  const { data, error } = await sb.from("blogs").select("cover_image, content");
  if (error || !data) throw new Error("Could not read blogs");
  const text = data.map((b: { cover_image: string | null; content: string | null }) => `${b.cover_image ?? ""}\n${b.content ?? ""}`).join("\n");
  return new Set(Array.from(text.matchAll(/\/images\/([^\s"'()<>?#\\]+)/g)).map(m => m[1]));
}

/** Delete one uploaded image, only if no blog (draft or published) uses it. */
export async function deleteImageIfUnused(url: string): Promise<boolean> {
  const m = /^\/images\/([^/\\]+)$/.exec(url);
  if (!m) return false;
  try {
    if ((await usedImages()).has(m[1])) return false;
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(m[1])));
    return true;
  } catch { return false; }
}

/** Delete every uploaded image that no blog uses (older than the grace period). */
export async function cleanupOrphanImages(): Promise<void> {
  try {
    const files = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
    if (!files.length) return;
    const used = await usedImages(); // if this fails we delete nothing
    for (const f of files) {
      if (used.has(f)) continue;
      const p = path.join(UPLOAD_DIR, f);
      const st = await fs.stat(p).catch(() => null);
      if (st?.isFile() && Date.now() - st.mtimeMs > GRACE_MS) await fs.unlink(p).catch(() => {});
    }
  } catch { /* never break saving because of cleanup */ }
}
