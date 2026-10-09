import { createServerClient } from "@/lib/supabase-server";

// Private Supabase Storage bucket. Images are never reached through a Supabase URL:
// they are served by the site itself at /images/[name].
export const BUCKET = "blog-images";

let ready = false;
async function ensureBucket() {
  if (ready) return;
  const sb = createServerClient();
  const { data } = await sb.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: false });
    if (error && !/exists/i.test(error.message)) throw new Error(error.message);
  }
  ready = true;
}

/** Saves an image under a unique name and returns that name. */
export async function saveImage(base: string, ext: string, body: Buffer, contentType: string): Promise<string> {
  await ensureBucket();
  const sb = createServerClient();
  let name = `${base}${ext}`;
  for (let i = 1; i < 200; i++) {
    const { error } = await sb.storage.from(BUCKET).upload(name, body, { contentType, upsert: false });
    if (!error) return name;
    if (!/exist|duplicate|409/i.test(`${error.message} ${(error as { statusCode?: string }).statusCode ?? ""}`)) throw new Error(error.message);
    name = `${base}-${i}${ext}`;
  }
  throw new Error("Could not find a free file name.");
}

export async function readImage(name: string): Promise<Buffer | null> {
  try {
    const { data, error } = await createServerClient().storage.from(BUCKET).download(name);
    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  } catch { return null; }
}

export async function removeImage(name: string) {
  await createServerClient().storage.from(BUCKET).remove([name]);
}

export async function listImages(): Promise<{ name: string; createdAt: number }[]> {
  const { data } = await createServerClient().storage.from(BUCKET).list("", { limit: 1000 });
  return (data ?? [])
    .filter(f => f.id) // skip folders
    .map(f => ({ name: f.name, createdAt: new Date(f.created_at ?? Date.now()).getTime() }));
}
