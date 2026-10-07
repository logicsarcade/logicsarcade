import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import logo from "../icons/logicsarcade.png";

const CTX = "https://schema.org";

export function organizationSchema() {
  return {
    "@context": CTX,
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "LogicsArcade",
    url: SITE_URL,
    logo: `${SITE_URL}${logo.src}`,
    email: "info@logicsarcade.com",
    sameAs: [
      "https://facebook.com/logicsarcade",
      "https://www.linkedin.com/company/logicsarcade",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": CTX,
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "LogicsArcade",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "ContactPage" | "AboutPage";
}) {
  return {
    "@context": CTX,
    "@type": opts.type ?? "WebPage",
    "@id": `${SITE_URL}${opts.path}#webpage`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

// Generated from lib/services.ts, so new services appear here automatically
export function servicesListSchema() {
  return {
    "@context": CTX,
    "@type": "ItemList",
    name: "LogicsArcade services",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/services/${s.slug}`,
      name: s.name,
    })),
  };
}

export function blogListSchema(blogs: { title: string; slug: string; excerpt: string; published_at: string | null; author_name: string }[]) {
  return {
    "@context": CTX,
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: "LogicsArcade Blog",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: blogs.slice(0, 20).map(b => ({
      "@type": "BlogPosting",
      headline: b.title,
      url: `${SITE_URL}/blog/${b.slug}`,
      description: b.excerpt,
      datePublished: b.published_at ?? undefined,
      author: { "@type": "Person", name: b.author_name },
    })),
  };
}
