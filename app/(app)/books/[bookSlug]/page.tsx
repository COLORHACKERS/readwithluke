import Link from "next/link";
import { notFound } from "next/navigation";
import { Home, Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import "./reader.css";

export default async function ReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { bookSlug } = await params;
  const { page } = await searchParams;

  const rawPage = Number(page || 1);
  const currentPage = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
  const isCoverPage = currentPage === 1;

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", bookSlug)
    .single();

  if (!book) notFound();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("book_id", book.id)
    .order("page_number", { ascending: true });

  const storyPages = pages || [];
  const totalPages = Math.max(storyPages.length, 1);

  const selectedPage =
    storyPages.find((p) => p.page_number === currentPage) || storyPages[0];

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const imageSrc =
    selectedPage?.image_url ||
    book.hero_url ||
    book.cover_url ||
    "/images/pricing-adventure-bg.png";

  const pageText =
    selectedPage?.text ||
    "This story page is waiting for words. Add text from the admin page.";

  return (
    <main className="readerViewport">
      <div className="bookFrame">
        <aside className="textPanel">
          <div className="readerTopControls">
            <Link href="/" className="readerIconBtn" aria-label="Home">
              <Home size={22} />
            </Link>

            <button
              className="readerIconBtn speaker"
              type="button"
              aria-label="Read aloud"
            >
              <Volume2 size={22} />
            </button>
          </div>

          <p className="readerEyebrow">
            Page {currentPage} / {totalPages}
          </p>

          <h1>{book.title}</h1>

          <p className="readerText">{pageText}</p>

          {isCoverPage && (
            <Link
              href={`/books/${book.slug}/read?page=2`}
              className="startReadingBtn"
            >
              START READING
            </Link>
          )}

          <div className="readerTextArrows">
            <Link
              href={`/books/${book.slug}/read?page=${previousPage}`}
              className={
                currentPage <= 1 ? "textArrow disabled" : "textArrow"
              }
              aria-label="Previous page"
            >
              <ArrowLeft size={34} strokeWidth={3.5} />
            </Link>

            <span className="textPageCount">
              Page {currentPage} / {totalPages}
            </span>

            <Link
              href={`/books/${book.slug}/read?page=${nextPage}`}
              className={
                currentPage >= totalPages ? "textArrow disabled" : "textArrow"
              }
              aria-label="Next page"
            >
              <ArrowRight size={34} strokeWidth={3.5} />
            </Link>
          </div>
        </aside>

        <section className="imagePanel">
          <img src={imageSrc} alt={`${book.title} page ${currentPage}`} />
        </section>
      </div>
    </main>
  );
}