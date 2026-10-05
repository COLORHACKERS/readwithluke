import Link from "next/link";
import ContentImage from "./ContentImage";
import { notFound } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { getCatalog, type CatalogKind } from "@/lib/public-catalog";
import { pageMetadata } from "@/lib/seo";
import "./catalog.css";

export type CatalogSearch = { category?: string | string[]; page?: string | string[] };
const bookCategories = ["All", "Adventure", "Animals", "Places", "Mystery", "Friends", "Bedtime", "Magic", "Action"];
const learnCategories = ["All", "Space", "Science", "Animals", "Nature", "History", "Ocean", "Dinosaurs", "How Things Work"];
const PAGE_SIZE = 16;
function selection(query: CatalogSearch) {
  const category = typeof query.category === "string" ? query.category : "All";
  const value = typeof query.page === "string" ? query.page : "1";
  const page = /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : 1;
  return { category, page };
}
function catalogHref(base: string, category: string, page: number) {
  const query = new URLSearchParams();
  if (category !== "All") query.set("category", category);
  if (page > 1) query.set("page", String(page));
  return base + (query.size ? `?${query}` : "");
}
export function catalogMetadata(kind: CatalogKind, query: CatalogSearch) {
  const { page, category } = selection(query);
  const books = kind === "books";
  const base = books ? "/library" : "/learn";
  const title = books ? "Online Storybooks for Kids Ages 5–10" : "Learning Adventures for Kids";
  const result = pageMetadata(title + (page > 1 ? ` — Page ${page}` : ""),
    books ? "Browse illustrated online books for kids: adventures, mysteries, animal stories, friendship stories, and bedtime reading with Luke."
      : "Explore science, space, animals, nature, history, and more through illustrated learning adventures for curious kids.",
    catalogHref(base, "All", page));
  if (category !== "All") result.robots = { index: false, follow: true };
  return result;
}

export default async function Catalog({ kind, query }: { kind: CatalogKind; query: CatalogSearch }) {
  const books = kind === "books";
  const base = books ? "/library" : "/learn";
  const categories = books ? bookCategories : learnCategories;
  const { category, page } = selection(query);
  const items = await getCatalog(kind);
  const filtered = category === "All" ? items : items.filter(item => (item.category || "").toLowerCase().includes(category.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (page > Math.max(1, totalPages)) notFound();
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = page === 1 ? filtered[0] : undefined;
  const preview = (slug: string) => `${books ? "/books" : "/learn"}/${encodeURIComponent(slug)}`;
  return <><Header /><main className="catalogPage">
    <div className="catalogBackdrop" aria-hidden="true"><ContentImage src="/images/home-hero.png" alt="" fill sizes="100vw" /></div>
    <section className="catalogHero">
      <div className="catalogIntro">
        <p className="catalogEyebrow">{books ? "READ WITH LUKE · AGES 5–10" : "LEARN WITH LUKE · CURIOUS MINDS"}</p>
        <h1>{books ? "Big adventures. One more page." : "Little questions. Big discoveries."}</h1>
        <p>{books ? "Online storybooks for kids who love mysteries, magical worlds, animals, and unexpected friendships." : "Explore science, space, animals, nature, and history through illustrated learning adventures."}</p>
        <Link href="/free-reads" className="catalogFreeLink">Try a free adventure <span aria-hidden="true">→</span></Link>
      </div>
      {featured && <Link href={preview(featured.slug)} className="catalogFeature">
        <ContentImage fill sizes="(max-width:700px) 100vw, 55vw" src={featured.hero_url || featured.hero_image_url || featured.image_url || featured.cover_url || "/images/6to5ratio.png"} alt={featured.title} preload />
        <div className="catalogFeatureCopy"><span>FEATURED {books ? "STORY" : "LEARNING"}</span><h2>{featured.title}</h2><p>{featured.description}</p><strong>Explore this adventure →</strong></div>
      </Link>}
    </section>
    <section className="catalogCollection" id="collection" aria-labelledby="catalog-heading">
      <div className="catalogCollectionHeading"><h2 id="catalog-heading">{books ? "Find their next favorite story" : "What will you discover today?"}</h2><span>{filtered.length} {filtered.length === 1 ? "adventure" : "adventures"}</span></div>
      <nav className="catalogFilters" aria-label={books ? "Book categories" : "Learning topics"}>
        {categories.map(label => <Link key={label} href={catalogHref(base, label, 1) + "#collection"} aria-current={category === label ? "true" : undefined}>{label}</Link>)}
      </nav>
      {visible.length ? <div className="catalogGrid">{visible.map((item, index) => <Link key={item.id} href={preview(item.slug)} className="catalogCover" aria-label={`Explore ${item.title}`}>
        <ContentImage sizes="(max-width:700px) 45vw, 25vw" src={item.cover_url || "/images/6to5ratio.png"} alt={`Cover of ${item.title}`} width={400} height={600} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
      </Link>)}</div> : <div className="catalogEmpty"><h3>No adventures in this category yet</h3><p>There are more worlds waiting to be explored.</p><Link href={base}>Browse all adventures →</Link></div>}
      {totalPages > 1 && <nav className="catalogPagination" aria-label="Catalog pages">
        {page > 1 && <Link href={catalogHref(base, category, page - 1) + "#collection"} rel="prev">← Previous</Link>}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => <Link key={number} href={catalogHref(base, category, number) + "#collection"} aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined}>{number}</Link>)}
        {page < totalPages && <Link href={catalogHref(base, category, page + 1) + "#collection"} rel="next">Next →</Link>}
      </nav>}
    </section>
  </main><Footer /></>;
}
