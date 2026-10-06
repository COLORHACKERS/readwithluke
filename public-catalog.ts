import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { createClient } from "@supabase/supabase-js";

export type CatalogKind = "books" | "learn_items";
export type CatalogItem = {
  id: string; title: string; slug: string; description: string | null;
  cover_url: string | null; category: string | null; is_published: boolean;
  age_range?: string | null; hero_url?: string | null; hero_image_url?: string | null;
  image_url?: string | null; seo_title: string | null; seo_description: string | null;
  seo_image_url: string | null; seo_noindex: boolean | null;
};

// Anonymous access only: public previews must respect the database's RLS rules.
// No session storage or service-role credential is used by public pages.
export function publicDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Public catalog configuration is missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(12000) }) },
  });
}

const commonFields = "id,title,slug,description,cover_url,category,is_published,seo_title,seo_description,seo_image_url,seo_noindex";
function fields(kind: CatalogKind) {
  return commonFields + (kind === "books" ? ",age_range,hero_url,hero_image_url" : ",image_url");
}

export const getCatalog = cache(async (kind: CatalogKind): Promise<CatalogItem[]> => {
  await connection();
  const db = publicDatabase();
  const items: CatalogItem[] = [];
  // Range requests avoid Supabase's default row limit silently truncating the sitemap.
  for (let start = 0; ; start += 500) {
    const { data, error } = await db.from(kind).select(fields(kind))
      .eq("is_published", true).order("created_at", { ascending: false })
      .order("id", { ascending: true }).range(start, start + 499);
    if (error) throw new Error(`Unable to load public ${kind}: ${error.code}`);
    const batch = (data || []) as unknown as CatalogItem[];
    items.push(...batch);
    if (batch.length < 500) break;
  }
  return items;
});

export const getPublishedItem = cache(async (kind: CatalogKind, slug: string): Promise<CatalogItem | null> => {
  await connection();
  const { data, error } = await publicDatabase().from(kind).select(fields(kind))
    .eq("is_published", true).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load public preview: ${error.code}`);
  return data as unknown as CatalogItem | null;
});
