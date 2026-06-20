import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import ReaderClient from "./ReaderClient";
import "./reader.css";
import ReaderGate from "./ReaderGate";

type Props = {
  params: Promise<{ bookSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ReadPage({ params, searchParams }: Props) {
  const { bookSlug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page || "1");

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", bookSlug)
    .maybeSingle();

  if (!book) {
    return (
      <>
        <Header />
        <main className="readerPage">
          <div className="readerEmpty">
            <h1>Book not found.</h1>
            <Link href="/library">Back to Library</Link>
          </div>
        </main>
      </>
    );
  }

  const { data: pages } = await supabase
    .from("book_pages")
    .select("*")
    .eq("book_id", book.id)
    .order("page_number", { ascending: true });

  if (!pages || pages.length === 0) {
    return (
      <>
        <Header />
        <main className="readerPage">
          <div className="readerEmpty">
            <h1>No pages uploaded yet.</h1>
            <Link href="/admin">Go to Admin</Link>
          </div>
        </main>
      </>
    );
  }

  const pageData =
    pages.find((p) => p.page_number === currentPage) || pages[0];

  const imageUrl =
    pageData.image_url ||
    pageData.page_image_url ||
    book.cover_image_url ||
    book.cover_url ||
    "/images/6to5ratio.png";

return (
  <>
    <Header />

    <ReaderGate>
      <ReaderClient
        bookSlug={book.slug}
        title={book.title}
        pageNumber={pageData.page_number}
        totalPages={pages.length}
        imageUrl={imageUrl}
        text={pageData.text || ""}
      />
    </ReaderGate>
  </>
);
}