import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./bookPreview.css";

type Props = {
  params: Promise<{ bookSlug: string }>;
};

export default async function BookPreviewPage({ params }: Props) {
  const { bookSlug } = await params;

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", bookSlug)
    .maybeSingle();

  if (!book) {
    return (
      <>
        <Header />
        <main className="bookPreviewPage">
          <div className="bookPreviewCard">
            <h1>Book not found.</h1>
            <Link href="/library" className="outlineButton">
              Back to Library
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { count } = await supabase
    .from("book_pages")
    .select("*", { count: "exact", head: true })
    .eq("book_id", book.id);

  const imageUrl =
    book.cover_url ||
    book.cover_image_url ||
    book.image_url ||
    "/images/6to5ratio.png";

  return (
    <>
      <Header />

      <main className="bookPreviewPage">
        <img src="/images/home-hero.png" alt="" className="bookPreviewBg" />

        <section className="bookPreviewCard">
          <div className="bookPreviewImage">
            <img src={imageUrl} alt={book.title} />
          </div>

          <div className="bookPreviewInfo">
            <p className="bookProgress">Page 1 of {count || 20}</p>
            <div className="previewBar">
              <span />
            </div>

            <h1>{book.title}</h1>

            <p className="bookDescription">
              {book.description ||
                "Open this magical story and begin a new reading adventure with Luke."}
            </p>

            <Link href={`/books/${book.slug}/read?page=1`} className="startButton">
              START READING
            </Link>

            <Link href="/library" className="outlineButton">
              BACK TO LIBRARY
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}