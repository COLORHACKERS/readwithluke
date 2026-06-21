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
    if (activeCategory === "All") return books;

    return books.filter((book) =>
      (book.category || "")
        .toLowerCase()
        .includes(activeCategory.toLowerCase())
    );
  }, [books, activeCategory]);

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
              <img
                src={featured.cover_url || "/images/6to5ratio.png"}
                alt={featured.title}
              />

              <div className="featuredOverlay">
                <span>NEW!</span>
                <h2>{featured.title}</h2>
                <p>
                  {featured.description ||
                    "Open this magical story and start reading with Luke."}
                </p>
                <strong>READ NOW</strong>
              </div>
            </Link>
          )}
        </section>

        <section className="bookRail">
          <h2>New Story Adventures</h2>

          <div className="bookScroller">
            {filteredBooks.map((book) => (
              <Link href={`/books/${book.slug}`} className="bookTile" key={book.id}>
                <img
                  src={book.cover_url || "/images/6to5ratio.png"}
                  alt={book.title}
                />

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

        <section className="libraryFilterBox">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "active" : ""}
            >
              {category}
            </button>
          ))}
        </section>

        {filteredBooks.length === 0 && (
          <div className="emptyLibrary">
            <h2>No books found.</h2>
            <p>Try another category or publish a new story.</p>
            <Link href="/admin">Open Admin</Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}