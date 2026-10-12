import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/public-catalog";

const SITE_URL = "https://www.readwithluke.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, learningAdventures] = await Promise.all([
    getCatalog("books"),
    getCatalog("learn_items"),
  ]);

  const staticPages = [
    "",
    "/library",
    "/learn",
    "/free-reads",
    "/about",
    "/membership",
    "/gift",
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  for (const book of books) {
    if (!book.slug || book.seo_noindex) continue;

    entries.push({
      url: `${SITE_URL}/books/${encodeURIComponent(book.slug)}`,
    });
  }

  for (const adventure of learningAdventures) {
    if (!adventure.slug || adventure.seo_noindex) continue;

    entries.push({
      url: `${SITE_URL}/learn/${encodeURIComponent(adventure.slug)}`,
    });
  }

  // Keep each URL only once.
  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values()
  );
}
