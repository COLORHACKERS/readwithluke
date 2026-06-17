import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import "./library.css";

type Book = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  age_range: string | null;
  category: string | null;
  is_published: boolean;
};

export default async function LibraryPage() {
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="libraryPage">
        <section className="libraryHero">
          <p>READ WITH LUKE LIBRARY</p>
          <h1>Pick your next adventure.</h1>
        </section>

        <section className="bookGrid">
          {(books || []).map((book: Book) => (
            <Link
              href={`/books/${book.slug}/read`}
              className="bookCard"
              key={book.id}
            >
              <div className="bookImage">
                <img
                  src={book.cover_url || "/images/6to5ratio.png"}
                  alt={book.title}
                />
                <span className="newBadge">NEW</span>
              </div>

              <div className="bookInfo">
                <div className="bookMeta">
                  <span>{book.age_range || "Ages 5–8"}</span>
                  <span>{book.category || "Adventure"}</span>
                </div>

                <h2>{book.title}</h2>

                <p>{book.description}</p>

                <strong>Read Story →</strong>
              </div>
            </Link>
          ))}
        </section>

        {(!books || books.length === 0) && (
          <div className="emptyLibrary">
            <h2>No published books yet.</h2>
            <p>Go to the admin page and publish your first story.</p>
            <Link href="/admin">Open Admin</Link>
          </div>
        )}
      </main>
    </>
  );
}