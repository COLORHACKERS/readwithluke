import type { Metadata } from "next";
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
  title: {
    default: "READ WITH LUKE",
    template: "%s | Read With Luke",
  },
  description: "Fun stories, adventure and learning for curious kids!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "READ WITH LUKE",
    description: "Fun stories, adventure and learning for curious kids!",
    url: "https://readwithluke.com",
    siteName: "Read With Luke",
    images: [
      {
        url: "/images/share-hero.png",
        width: 1200,
        height: 630,
        alt: "Read With Luke",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "READ WITH LUKE",
    description: "Fun stories, adventure and learning for curious kids!",
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
      </body>

      <GoogleAnalytics gaId="G-JBRLDLGXG7" />
    </html>
  );
}
