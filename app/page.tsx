"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./home.css";

type Book = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url?: string | null;
  hero_url?: string | null;
  image_url?: string | null;
  age_range?: string | null;
  category?: string | null;
  created_at?: string;
};

type LearnItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url?: string | null;
  image_url?: string | null;
  category?: string | null;
  created_at?: string;
};



function fillToSix<T>(items: T[]) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: 6 }, (_, index) => {
    return items[index % items.length];
  });
}

function getBookFeatureImage(book: Book) {
  return (
    book.hero_url ||
    book.image_url ||
    book.cover_url ||
    "/images/6to5ratio.png"
  );
}

function getBookCover(book: Book) {
  return (
    book.cover_url ||
    book.image_url ||
    book.hero_url ||
    "/images/6to5ratio.png"
  );
}

function getLearnImage(item: LearnItem) {
  return (
    item.image_url ||
    item.cover_url ||
    "/images/6to5ratio.png"
  );
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [learnItems, setLearnItems] = useState<LearnItem[]>([]);

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    const [booksResponse, learnResponse] = await Promise.all([
      supabase
        .from("books")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("learn_items")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    if (booksResponse.error) {
      console.error("Unable to load homepage books:", booksResponse.error);
    } else {
      setBooks(booksResponse.data || []);
    }

    if (learnResponse.error) {
      console.error(
        "Unable to load homepage learning posts:",
        learnResponse.error
      );
    } else {
      setLearnItems(learnResponse.data || []);
    }
  }

  const featuredBook = books[0];
  const featuredLearn = learnItems[0];
  const secondaryLearn = learnItems[1] || learnItems[0];

  const marqueeBooks = fillToSix(books);
  const marqueeLearnItems = fillToSix(learnItems);

  return (
    <>
      <Header />

      <main className="homePage">
        <img
          src="/images/home-hero.png"
          alt=""
          className="homeBg"
        />

        <section className="homeHero">
          <div className="homeHeroInner">
            <div className="homeHeroText">
              <h1>
                STORIES.
                <br />
                ADVENTURE.
                <br />
                KNOWLEDGE.
              </h1>

              <p>
                Join Luke on his reading and learning adventures in cinematic
                style.
              </p>
            </div>

            {featuredBook && (
              <Link
                href={`/books/${featuredBook.slug}`}
                className="featuredBookCard"
              >
                <img
                  src={getBookFeatureImage(featuredBook)}
                  alt={featuredBook.title}
                />

                <div className="featuredBookShade" />

                <div className="featuredBookContent">
                  <span className="featuredEyebrow">
                    {featuredBook.category || "Latest Adventure"}
                  </span>

                  <h2>{featuredBook.title}</h2>

                  {featuredBook.description && (
                    <p>{featuredBook.description}</p>
                  )}

                  <span className="orangeButton">
                    Read Story
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            )}
          </div>
        </section>

        {marqueeBooks.length > 0 && (
          <section className="homeMarquee">
            <div className="homeSectionHeading">
              <h2>READ WITH LUKE</h2>
            </div>

            <div className="marqueeWindow">
              <div className="marqueeTrack">
                {[0, 1].map((setNumber) => (
                  <div
                    className="marqueeSet"
                    key={`book-set-${setNumber}`}
                    aria-hidden={setNumber === 1}
                  >
                    {marqueeBooks.map((book, index) => (
                      <Link
                        href={`/books/${book.slug}`}
                        className="marqueeCard"
                        key={`${setNumber}-${book.id}-${index}`}
                        tabIndex={setNumber === 1 ? -1 : undefined}
                      >
                        <img
                          src={getBookCover(book)}
                          alt={setNumber === 0 ? book.title : ""}
                        />

                        <div className="marqueeCardLabel">
                          <span>{book.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredLearn && (
          <section className="learningSection">
            <div className="learningFeatureGrid">
              <Link
                href={`/learn/${featuredLearn.slug}`}
                className="largeLearningFeature"
              >
                <img
                  src={getLearnImage(featuredLearn)}
                  alt={featuredLearn.title}
                />

                <div className="learningFeatureShade" />

                <div className="largeLearningContent">
                  <span className="featuredEyebrow">
                    {featuredLearn.category || "LEARN WITH LUKE"}
                  </span>

                  <h2>{featuredLearn.title}</h2>

                  {featuredLearn.description && (
                    <p>{featuredLearn.description}</p>
                  )}

                  <span className="orangeButton">
                    Start Learning
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>

              {secondaryLearn && (
                <Link
                  href={`/learn/${secondaryLearn.slug}`}
                  className="smallLearningFeature"
                >
                  <div className="smallLearningImage">
                    <img
                      src={getLearnImage(secondaryLearn)}
                      alt={secondaryLearn.title}
                    />
                  </div>

                  <div className="smallLearningContent">
                    <span className="smallLearningEyebrow">
                      NEWEST LEARNING 
                    </span>

                    <h3>{secondaryLearn.title}</h3>

                    {secondaryLearn.description && (
                      <p>{secondaryLearn.description}</p>
                    )}

                    <span className="exploreLink">
                      Explore
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}

        {marqueeLearnItems.length > 0 && (
          <section className="homeMarquee learningMarquee">
            <div className="homeSectionHeading">
              <h2>New Things to Learn About!</h2>
            </div>

            <div className="marqueeWindow">
              <div className="marqueeTrack marqueeTrackReverse">
                {[0, 1].map((setNumber) => (
                  <div
                    className="marqueeSet"
                    key={`learn-set-${setNumber}`}
                    aria-hidden={setNumber === 1}
                  >
                    {marqueeLearnItems.map((item, index) => (
                      <Link
                        href={`/learn/${item.slug}`}
                        className="marqueeCard learnMarqueeCard"
                        key={`${setNumber}-${item.id}-${index}`}
                        tabIndex={setNumber === 1 ? -1 : undefined}
                      >
                        <img
                          src={getLearnImage(item)}
                          alt={setNumber === 0 ? item.title : ""}
                        />

                        <div className="marqueeCardLabel">
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

       <section className="homeBenefitsImageSection">
  <img
    src="/images/learntoreadwithluke.png"
    alt="Learn to Read"
    className="homeBenefitsImage"
  />
</section>
      </main>

      <Footer />
    </>
  );
}
