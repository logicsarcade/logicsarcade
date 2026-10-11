import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import favicon from "../icons/favicon.ico";
import favicon16 from "../icons/favicon-16x16.png";
import favicon32 from "../icons/favicon-32x32.png";
import appleIcon from "../icons/apple-touch-icon.png";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-sg", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter", display: "swap" });

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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
