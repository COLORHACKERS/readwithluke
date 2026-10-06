import type { Metadata } from "next";

export const SITE_URL = "https://www.readwithluke.com";

export const SITE_DESCRIPTION =
  "Explore online stories for kids ages 5–10, with audio read-along and illustrated learning adventures. Try a complete story free with Read With Luke.";

export function pageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Read With Luke`,
      description,
      url,
      siteName: "Read With Luke",
      type: "website",
      images: [
        {
          url: "/images/share-hero.png",
          alt: "Read With Luke reading adventures",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Read With Luke`,
      description,
      images: ["/images/share-hero.png"],
    },
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
