"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
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

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    loadBooks();

    setLiked(JSON.parse(localStorage.getItem("rwl-liked-books") || "[]"));
    setSaved(JSON.parse(localStorage.getItem("rwl-saved-books") || "[]"));
  }, []);

  async function loadBooks() {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setBooks(data || []);
  }

  function toggleLiked(id: string) {
    const next = liked.includes(id)
      ? liked.filter((bookId) => bookId !== id)
      : [...liked, id];

    setLiked(next);
    localStorage.setItem("rwl-liked-books", JSON.stringify(next));
  }

  function toggleSaved(id: string) {
    const next = saved.includes(id)
      ? saved.filter((bookId) => bookId !== id)
      : [...saved, id];

    setSaved(next);
    localStorage.setItem("rwl-saved-books", JSON.stringify(next));
  }

  const categories = ["All", "Adventure", "Animals", "Places", "Mystery", "Friends", "Bedtime"];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        (book.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        (book.category || "").toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [books, search, activeCategory]);

  return (
    <>
      <Header />

      <main className="libraryPage">
        <img src="/images/home-hero.png" alt="" className="libraryBg" />

        <section className="libraryHero">
          <h1>Pick your adventure.</h1>
          <p>Read with Luke Library &gt;</p>

          <div className="libraryTools">
            <form
              className="librarySearch"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search for a book type"
              />

              <button type="submit">
                <img src="/images/icon-send.png" alt="" />
              </button>
            </form>

            <div className="categoryPills">
              {categories.slice(1).map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category ? "All" : category
                    )
                  }
                  className={activeCategory === category ? "active" : ""}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="libraryGrid">
          {filteredBooks.map((book) => (
            <article className="libraryCard" key={book.id}>
              <img
                src={book.cover_url || "/images/6to5ratio.png"}
                alt={book.title}
                className="libraryCardImage"
              />

              <div className="libraryCardBody">
                <h2>{book.title}</h2>

                <p>
                  {book.description ||
                    "A magical story from Read With Luke."}
                </p>

                <div className="libraryCardActions">
                <button
  type="button"
  onClick={() => toggleLiked(book.id)}
  className={`iconBtn ${liked.includes(book.id) ? "active" : ""}`}
  aria-label="Like book"
>
  <img src="/images/heart.png" alt="" />
</button>

                  <Link href={`/books/${book.slug}`} className="readBtn">
  READ
</Link>

               <button
  type="button"
  onClick={() => toggleSaved(book.id)}
  className={`iconBtn ${saved.includes(book.id) ? "active" : ""}`}
  aria-label="Save book"
>
  <img src="/images/bookmark.png" alt="" />
</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filteredBooks.length === 0 && (
          <div className="emptyLibrary">
            <h2>No books found.</h2>
            <p>Try another search or publish a new story.</p>
            <Link href="/admin">Open Admin</Link>
          </div>
        )}
       </main>

      <Footer />
    </>
  );
}