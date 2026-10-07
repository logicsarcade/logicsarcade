import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import favicon from "../icons/favicon.ico";
import favicon16 from "../icons/favicon-16x16.png";
import favicon32 from "../icons/favicon-32x32.png";
import appleIcon from "../icons/apple-touch-icon.png";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: favicon.src },
      { url: favicon16.src, sizes: "16x16", type: "image/png" },
      { url: favicon32.src, sizes: "32x32", type: "image/png" },
    ],
    shortcut: favicon.src,
    apple: appleIcon.src,
  },
  alternates: { canonical: "./" },
  openGraph: { siteName: "LogicsArcade", type: "website" },
  title: "LogicsArcade — Scalable Web & Mobile Apps",
  description:
    "Pakistan's leading software house. MERN, Next.js, React Native, Shopify, SaaS, AI Integrations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
