
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./home-book-carousel.css";

type Book = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  age_range: string | null;
};

export default function HomeBookCarousel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, slug, cover_url, age_range")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Homepage books error:", error);
        setLoading(false);
        return;
      }

      setBooks(data || []);
      setLoading(false);
    }

    loadBooks();
  }, []);

  function scrollBooks(direction: "left" | "right") {
    if (!railRef.current) return;

    const amount = railRef.current.clientWidth * 0.8;

    railRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (loading) {
    return (
      <section className="homeBooksSection">
        <p className="homeBooksLoading">Loading stories...</p>
      </section>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <section className="homeBooksSection">
      <div className="homeBooksHeader">
        <div>
          <p className="homeBooksEyebrow">READ WITH LUKE</p>
          <h2>Explore Read With Luke</h2>
          <p>Start reading some of our newest adventures.</p>
        </div>

        <Link href="/library" className="homeBooksViewAll">
          VIEW ALL BOOKS →
        </Link>
      </div>

      <div className="homeBooksCarousel">
        <button
          type="button"
          className="homeBooksArrow homeBooksArrowLeft"
          onClick={() => scrollBooks("left")}
          aria-label="Scroll books left"
        >
          ‹
        </button>

        <div className="homeBooksRail" ref={railRef}>
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              className="homeBookCard"
            >
              <div className="homeBookCover">
                <img
                  src={book.cover_url || "/images/6to5ratio.png"}
                  alt={book.title}
                />
              </div>

              <h3>{book.title}</h3>

              {book.age_range && <p>{book.age_range}</p>}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="homeBooksArrow homeBooksArrowRight"
          onClick={() => scrollBooks("right")}
          aria-label="Scroll books right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
