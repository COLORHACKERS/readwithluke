import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./library.css";

export default async function LibraryPage() {
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="libraryWorld">
      <section className="libraryIntro">
        <p>READ WITH LUKE</p>
        <h1>Your Library</h1>
        <span>Pick a story and keep your adventure going.</span>
      </section>

      <section className="libraryFilters">
        <button className="active">▦ All Books</button>
        <button>▶ In Progress</button>
        <button>✓ Completed</button>
      </section>

      <section className="libraryBookGrid">
        {books?.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.slug}/read?page=1`}
            className="libraryBookCard"
          >
            <img
              src={book.cover_url || "/images/pricing-adventure-bg.png"}
              alt={book.title}
            />

            <div className="libraryBookShade" />

            <em>New</em>

            <div className="libraryBookInfo">
              <h2>{book.title}</h2>

              <div className="libraryMeta">
                {book.age_level && <span>Ages {book.age_level}</span>}
                {book.story_type && <span>{book.story_type}</span>}
              </div>

              <p>{book.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}