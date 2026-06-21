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
        <main className="bookPreviewPage bookPreviewEmpty">
          <h1>Book not found.</h1>
          <Link href="/library" className="previewOutlineButton">
            BACK TO LIBRARY
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const { count } = await supabase
    .from("book_pages")
    .select("*", { count: "exact", head: true })
    .eq("book_id", book.id);

  const heroImage =
    book.cover_url ||
    book.cover_image_url ||
    book.image_url ||
    "/images/6to5ratio.png";

  return (
    <>
      <Header />

      <main className="bookPreviewPage">
        <img src={heroImage} alt="" className="bookPreviewBg" />
        <div className="bookPreviewShade" />

        <section className="previewContent">
          <div className="previewProgressText">
            Progress: Page 1 of {count || 20}
          </div>

          <div className="previewProgressBar">
            <span />
          </div>

          <h1>{book.title}</h1>

<p className="previewDescription">
  {book.description ||
    "Stories for kids that are magical, exciting, and cinematic like movies. Fascinating facts and fun learnings that inspire and grow imagination!"}
</p>

          <div className="previewButtons">
            <Link
              href={`/books/${book.slug}/read?page=1`}
              className="previewStartButton"
            >
              START READING
            </Link>

            <Link href="/library" className="previewOutlineButton">
              BACK TO LIBRARY
            </Link>
          </div>

          <div className="previewIconRow">
            <button>♥</button>
            <button>▮</button>
            <button>⇧</button>
          </div>
        </section>
        <div className="previewBottomTagline">
  MYSTERY. FRIENDSHIP. ADVENTURE.
</div>
      </main>

      <Footer />
    </>
  );
}