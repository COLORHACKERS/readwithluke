import type { Metadata } from "next";
import { getPublishedItem, type CatalogKind } from "@/lib/public-catalog";
import { bookEditorial } from "@/lib/book-editorial";
import { SITE_URL } from "@/lib/seo";
export async function previewMetadata(kind: CatalogKind, slug: string): Promise<Metadata> {
  const item = await getPublishedItem(kind, slug);
  if (!item) return { title: "Adventure not found", robots: { index: false, follow: true } };
  const editorial = kind === "books" ? bookEditorial[slug] : undefined;
  const title = item.seo_title?.trim() || `${editorial?.seoTitle || item.title} | ${kind === "books" ? "Read With Luke" : "Learn With Luke"}`;
  const description = item.seo_description?.trim() || editorial?.seoDescription || item.description?.trim() || `Explore ${item.title}, an illustrated adventure for kids on Read With Luke.`;
  const url = `${SITE_URL}/${kind === "books" ? "books" : "learn"}/${encodeURIComponent(item.slug)}`;
  const image = new URL(item.seo_image_url || item.cover_url || "/images/home-hero.png", SITE_URL).toString();
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    robots: { index: !item.seo_noindex, follow: true, "max-image-preview": "large" },
    openGraph: { title, description, url, siteName: "Read With Luke", type: "article", images: [{ url: image, alt: `Cover of ${item.title}` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
