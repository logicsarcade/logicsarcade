import fs from "fs";
import path from "path";

// Old location (inside the project). Still read from, so existing images keep working.
const LEGACY_DIR = path.join(process.cwd(), "uploads", "images");

// New uploads go OUTSIDE the project folder, so a redeploy / git pull / rebuild
// (which replaces the project folder) can never delete them.
// Override with UPLOAD_DIR in .env to choose an exact path.
function resolveUploadDir(): string {
  if (process.env.UPLOAD_DIR) return path.resolve(process.env.UPLOAD_DIR);
  const outside = path.join(process.cwd(), "..", "logicsarcade-uploads", "images");
  try {
    fs.mkdirSync(outside, { recursive: true });
    fs.accessSync(outside, fs.constants.W_OK);
    return outside;
  } catch {
    return LEGACY_DIR; // parent folder not writable on this host
  }
}

export const UPLOAD_DIR = resolveUploadDir();
export const UPLOAD_DIRS = Array.from(new Set([UPLOAD_DIR, LEGACY_DIR]));

export const IMAGE_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
};
