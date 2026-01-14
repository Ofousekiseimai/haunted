import type { Metadata } from "next";
import Script from "next/script";
import { Anton, Source_Code_Pro, Sora } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { GoogleAnalyticsTracker } from "@/components/analytics/google-analytics";
import { ClientGuards } from "@/components/layout/client-guards";
import { getRequestLocale } from "@/lib/locale-server";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${sora.variable} ${anton.variable} ${sourceCode.variable} text-n-1 antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
(function() {
  try {
    var storageKey = 'haunted-theme';
    var stored = window.localStorage.getItem(storageKey);
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('color-scheme', theme);
  } catch (error) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.setProperty('color-scheme', 'dark');
  }
})();
          `}
        </Script>
        <ThemeProvider>
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
          <div className="flex min-h-screen flex-col pt-[4.75rem] lg:pt-[5.25rem]">
            <Header initialLocale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
