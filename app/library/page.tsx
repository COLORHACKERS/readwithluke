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

  useEffect(() => {
    loadBooks();
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

  const categories = [
    "All",
    "Adventure",
    "Animals",
    "Places",
    "Mystery",
    "Friends",
    "Bedtime",
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        (book.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        (book.category || "")
          .toLowerCase()
          .includes(activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [books, search, activeCategory]);

  const featured = filteredBooks[0];

  return (
    <>
      <Header />

      <main className="libraryPage">
        <img src="/images/home-hero.png" alt="" className="libraryBg" />

        <section className="libraryHero">
          <div className="libraryHeroText">
            <h1>
              READ
              <br />
              WITH
              <br />
              LUKE.
            </h1>

            <p>
              Magical stories, adventures, mysteries,
              <br />
              animals, bedtime books, and cinematic
              <br />
              reading moments for kids.
            </p>
          </div>

          {featured && (
            <Link href={`/books/${featured.slug}`} className="featuredBook">
              <div className="featuredImageWrap">
                <img
                  src={featured.cover_url || "/images/6to5ratio.png"}
                  alt={featured.title}
                />

                <div className="featuredBadge">NEW!</div>
              </div>

              <div className="featuredBookInfo">
                <h2>{featured.title}</h2>
                <p>
                  {featured.description ||
                    "Open this magical story and start reading with Luke."}
                </p>
              </div>
            </Link>
          )}
        </section>

        <section className="libraryTools">
          <form className="librarySearch" onSubmit={(e) => e.preventDefault()}>
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
        </section>

        <section className="bookRail">
          <h2>New Story Adventures</h2>

          <div className="bookScroller">
            {filteredBooks.map((book, index) => (
              <Link href={`/books/${book.slug}`} className="bookTile" key={book.id}>
                <div className="bookTileImage">
                  <img
                    src={book.cover_url || "/images/6to5ratio.png"}
                    alt={book.title}
                  />

                  {index === 0 && <span>NEW!</span>}
                </div>

                <div className="bookTileInfo">
                  <h3>{book.title}</h3>
                  <p>
                    {book.description ||
                      "A magical story from Read With Luke."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
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