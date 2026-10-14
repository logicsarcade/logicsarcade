"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = "G-J7948NZC1W";

// One Google tag for the whole site (added once in the root layout).
// Admin pages are skipped so your own visits don't count as traffic.
export default function GoogleAnalytics() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
    </>
  );
}
