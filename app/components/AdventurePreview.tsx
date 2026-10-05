import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ShareButton from "./ShareButton";
import ContentImage from "./ContentImage";
import { getCatalog, getPublishedItem, publicDatabase, type CatalogKind } from "@/lib/public-catalog";
import { bookEditorial } from "@/lib/book-editorial";
import { SITE_URL, jsonLd } from "@/lib/seo";
import "./adventure-preview.css";

export default async function AdventurePreview({ kind, slug }: { kind: CatalogKind; slug: string }) {
  const item = await getPublishedItem(kind, slug);
  if (!item) notFound();
  const books = kind === "books";
  const db = publicDatabase();
  const [pages, worksheets, catalog] = await Promise.all([
    db.from(books ? "book_pages" : "learn_pages").select("*", { count: "exact", head: true }).eq(books ? "book_id" : "learn_item_id", item.id),
    books ? Promise.resolve({ count: 0 }) : db.from("learn_worksheets").select("*", { count: "exact", head: true }).eq("learn_item_id", item.id),
    getCatalog(kind),
  ]);
  const count = pages.error ? null : pages.count;
  const hasWorksheets = (worksheets.count || 0) > 0;
  const base = books ? "/books" : "/learn";
  const parent = books ? "/library" : "/learn";
  const path = `${base}/${encodeURIComponent(item.slug)}`;
  const url = `${SITE_URL}${path}`;
  const editorial = books ? bookEditorial[item.slug] : undefined;
  const themes = editorial?.themes || (item.category || "").split(",").map(value => value.trim()).filter(Boolean);
  const related = catalog.filter(other => other.id !== item.id).sort((a, b) => {
    const matches = (category: string | null) => themes.some(theme => (category || "").toLowerCase().includes(theme.toLowerCase())) ? 1 : 0;
    return matches(b.category) - matches(a.category);
  }).slice(0, 4);
  const description = editorial?.synopsis || item.description || `Discover ${item.title}, an illustrated ${books ? "story" : "learning adventure"} on Read With Luke.`;
  const questions = editorial?.questions || (books
    ? ["What do you think will happen next?", "Which moment surprised you most?", "How would you tell this story in your own words?"]
    : ["What is one new thing you discovered?", "Which part would you like to explore further?", "How could you explain this idea to a friend?"]);
  const schema = {
    "@context": "https://schema.org", "@type": books ? "Book" : "LearningResource", "@id": `${url}#adventure`,
    name: item.title, url, description, inLanguage: "en", image: new URL(item.cover_url || "/images/6to5ratio.png", SITE_URL).toString(),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Read With Luke", url: SITE_URL },
    ...(books ? { bookFormat: "https://schema.org/EBook", ...(count ? { numberOfPages: count } : {}) } : { learningResourceType: "Illustrated learning adventure" }),
    audience: { "@type": "Audience", audienceType: "Children" },
    ...(themes.length ? { keywords: themes.join(", ") } : {}),
  };
  return <><Header /><main className="adventurePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: books ? "Books" : "Learning", item: `${SITE_URL}${parent}` },
      { "@type": "ListItem", position: 3, name: item.title, item: url },
    ] }) }} />
    <section className="adventureHero">
      <div className="adventureArt"><ContentImage src={item.hero_url || item.hero_image_url || item.image_url || item.cover_url || "/images/6to5ratio.png"} alt="" fill sizes="100vw" preload /></div>
      <div className="adventureHeroInner">
        <nav className="adventureBreadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={parent}>{books ? "Books" : "Learning"}</Link><span aria-hidden="true">/</span><span aria-current="page">{item.title}</span></nav>
        <div className="adventureHeroGrid"><div className="adventureCopy">
          <p className="adventureEyebrow">{books ? "AN ORIGINAL READING ADVENTURE" : "A LEARN WITH LUKE ADVENTURE"}</p>
          <h1>{item.title}</h1>
          <p className="adventureSummary">{editorial?.subtitle || item.description || "Open a new world of stories and discovery with Luke."}</p>
          <ul className="adventureFacts" aria-label="Adventure details"><li>{books ? "Online storybook" : "Illustrated learning"}</li>{item.age_range && <li>{item.age_range}</li>}{count ? <li>{count} pages</li> : null}{hasWorksheets && <li>Printable worksheets</li>}</ul>
          <div className="adventureActions"><Link href={`${path}/read?page=1`} className="adventurePrimary">{books ? "Start reading" : "Start learning"} →</Link><Link href="/free-reads" className="adventureSecondary">Try a free adventure</Link></div>
          {hasWorksheets && <Link className="adventureWorksheet" href={`${path}/read?worksheets=1`}>Open printable worksheets →</Link>}
          <div className="adventureShare"><ShareButton title={item.title} text={item.seo_description || item.description || item.title} url={url} /></div>
        </div><div className="adventureCover"><ContentImage src={item.cover_url || "/images/6to5ratio.png"} alt={`Cover of ${item.title}`} width={400} height={600} sizes="(max-width: 700px) 60vw, 320px" /></div></div>
      </div>
    </section>
    <div className="adventureDetails">
      <div className="adventureDetailGrid"><section><p className="adventureEyebrow">{books ? "BEHIND THE COVER" : "FEED THEIR CURIOSITY"}</p><h2>{books ? "About this story" : "About this adventure"}</h2><p>{description}</p>{themes.length > 0 && <ul className="adventureThemes" aria-label="Topics">{themes.map(theme => <li key={theme}>{theme}</li>)}</ul>}</section>
        <aside><h2>Read, pause, talk</h2><p>Use these conversation starters while reading together:</p><ul>{questions.map(question => <li key={question}>{question}</li>)}</ul></aside></div>
      <section className="adventureFaq"><h2>Questions before you start?</h2>
        {item.age_range && <details><summary>What age is {item.title} for?</summary><p>The recommended age range is {item.age_range}. Children can read with a grown-up or explore independently at their own pace. An age range is not a formal reading-level assessment.</p></details>}
        {count ? <details><summary>How many pages are there?</summary><p>This adventure has {count} pages{hasWorksheets ? ", with printable worksheets available separately" : ""}.</p></details> : null}
        <details><summary>Can we try Read With Luke for free?</summary><p>Yes. Our <Link href="/free-reads">free adventures</Link> include one complete story and one complete learning adventure, with no account or payment information required. <Link href="/membership">Membership</Link> provides access to the full collection.</p></details>
        <details><summary>How do we read this online?</summary><p>Choose {books ? "Start reading" : "Start learning"} to open the reader. You can move through the pages at your own pace. For member-only adventures, sign in with your parent account.</p></details>
      </section>
      {related.length > 0 && <section className="adventureRelated"><div className="adventureRelatedHeading"><h2>Another world is waiting</h2><Link href={parent}>View all →</Link></div><div className="adventureRelatedGrid">{related.map(other => <Link href={`${base}/${encodeURIComponent(other.slug)}`} key={other.id}><ContentImage src={other.cover_url || "/images/6to5ratio.png"} alt={`Cover of ${other.title}`} width={400} height={600} sizes="(max-width:700px) 45vw, 25vw" loading="lazy" /><h3>{other.title}</h3></Link>)}</div></section>}
    </div>
  </main><Footer /></>;
}
