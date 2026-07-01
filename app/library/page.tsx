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
  const [page, setPage] = useState(1);

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
    "Magic",
    "Action"
  ];

  const filteredBooks = useMemo(() => {
    if (activeCategory === "All") return books;

    return books.filter((book) =>
      (book.category || "")
        .toLowerCase()
        .includes(activeCategory.toLowerCase())
    );
  }, [books, activeCategory]);
  const booksPerPage = 16;
const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
const visibleBooks = filteredBooks.slice(
  (page - 1) * booksPerPage,
  page * booksPerPage
);

  const featured = filteredBooks[0];

  return (
    <>
      <Header />

      <main className="libraryPage">
        <img src="/images/home-hero.png" alt="" className="libraryBg" />

        <section className="libraryHero">
          <div className="libraryHeroText">
            <h1>
              MYSTERY.
              <br />
              ADVENTURE.
              <br />
              FREINDSHIPS.
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
                src={book.cover_url || "/images/6to5ratio.png"}
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
           {visibleBooks.map((book) => (
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
              onClick={() => {
  setActiveCategory(category);
  setPage(1);
}}
              className={activeCategory === category ? "active" : ""}
            >
              {category}
            </button>
          ))}
          {totalPages > 1 && (
  <div className="libraryPagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        className={page === index + 1 ? "active" : ""}
        onClick={() => setPage(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}
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
