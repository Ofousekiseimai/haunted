import type { Metadata } from "next";
import Script from "next/script";
import { EB_Garamond, JetBrains_Mono, Manrope, Source_Code_Pro } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GoogleAnalyticsTracker } from "@/components/analytics/google-analytics";
import { ClientGuards } from "@/components/layout/client-guards";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { getRequestLocale } from "@/lib/locale-server";

// Greek is the primary language of this site, so every face here must ship a
// Greek subset. Sora and Cormorant Garamond do not have one at all — they were
// silently falling back to the OS sans for every Greek glyph on the site.
// greek-ext carries the polytonic marks the pre-1982 newspaper transcriptions need.
const manrope = Manrope({
  subsets: ["latin", "greek"],
  variable: "--font-manrope",
  display: "swap",
});

const garamond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin", "greek", "greek-ext"],
  variable: "--font-garamond",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "greek"],
  variable: "--font-jetbrains",
  display: "swap",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin", "greek"],
  variable: "--font-source-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haunted.gr"),
  title: {
    default: "haunted.gr",
    template: "%s | haunted.gr",
  },
  description: "Λαογραφία, μύθοι και στοιχειωμένες ιστορίες από κάθε γωνιά της Ελλάδας.",
  openGraph: {
    type: "website",
    siteName: "haunted.gr",
    title: "haunted.gr",
    description: "Λαογραφία, μύθοι και στοιχειωμένες ιστορίες από κάθε γωνιά της Ελλάδας.",
    locale: "el_GR",
    url: "https://haunted.gr",
    images: [
      {
        url: "/images/og-default-image.webp",
        width: 1200,
        height: 630,
        alt: "haunted.gr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "haunted.gr",
    description:
      "Λαογραφία, μύθοι και στοιχειωμένες ιστορίες από κάθε γωνιά της Ελλάδας.",
    images: [
      {
        url: "/images/og-default-image.webp",
        width: 1200,
        height: 630,
        alt: "haunted.gr",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${garamond.variable} ${jetbrains.variable} ${sourceCode.variable} antialiased`}>

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-FXJ30XVLMD"
            strategy="afterInteractive"
          />
          <Script id="ga-gtag" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-FXJ30XVLMD', {
  page_path: window.location.pathname
});
            `}
          </Script>
          <ClientGuards />
          <Suspense fallback={null}>
            <GoogleAnalyticsTracker />
          </Suspense>
          {/* Atmosphere. Fixed behind everything, so content reads as
              travelling across a static plate rather than as cards on flat
              black. */}
          <div className="plate-grid" aria-hidden="true" />
          <div className="plate-horizon" aria-hidden="true" />

          <SmoothScroll>
            <div className="relative z-[1] flex min-h-screen flex-col">
              <Header initialLocale={locale} />
              <main className="flex-1 pt-[var(--masthead-h)]">{children}</main>
              <Footer locale={locale} />
            </div>
          </SmoothScroll>
      </body>
    </html>
  );
}
