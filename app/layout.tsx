import type { Metadata } from "next";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { "max-image-preview": "large" },
  title: {
    default: "READ WITH LUKE",
    template: "%s | Read With Luke",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "READ WITH LUKE",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Read With Luke",
    images: [
      {
        url: "/images/share-hero.png",
        width: 1200, height: 630,
        alt: "Read With Luke",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "READ WITH LUKE",
    description: SITE_DESCRIPTION,
    images: ["/images/share-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-JBRLDLGXG7" />
      </body>

    </html>
  );
}
