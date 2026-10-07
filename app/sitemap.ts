import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/blog-queries";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

// Always generated fresh from the database, never cached at build time,
// so a newly published blog appears in the sitemap immediately.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map(sv => ({ url: `${SITE_URL}/services/${sv.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const blogs = await getPublishedBlogs(); // only published posts, never drafts
    for (const b of blogs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = b as any;
      const img: string | undefined = m.cover_image
        ? (/^https?:\/\//.test(m.cover_image) ? m.cover_image : `${SITE_URL}${m.cover_image.startsWith("/") ? "" : "/"}${m.cover_image}`)
        : undefined;
      pages.push({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: new Date(m.updated_at || m.published_at || now),
        changeFrequency: "weekly",
        priority: 0.8,
        ...(img ? { images: [img] } : {}),
      });
    }
  } catch (e) {
    console.error("[sitemap]", e); // still return the static pages instead of failing
  }
  return pages;
}
