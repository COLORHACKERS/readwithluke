"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";

/*
 * Reuse the Learn With Luke marketing CSS.
 * This makes both pages match automatically.
 */
import "../learn-with-luke/learn-with-luke.css";

type Book = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  age_range: string | null;
  category: string | null;
  is_published: boolean;
  created_at?: string;
};

type VisualProps = {
  src?: string;
  alt: string;
  filename: string;
  className?: string;
};

const storyDiscoveries = [
  {
    number: "1",
    title: "Meet the Character",
    image: "/images/read-story-character.jpg",
    filename: "read-story-character.jpg",
    alt: "A cinematic story scene introducing Luke and another memorable character at the beginning of an adventure.",
  },
  {
    number: "2",
    title: "Enter the World",
    image: "/images/read-story-world.jpg",
    filename: "read-story-world.jpg",
    alt: "A wide cinematic story world filled with mountains, forests, glowing skies and places waiting to be explored.",
  },
  {
    number: "3",
    title: "Discover the Problem",
    image: "/images/read-story-problem.jpg",
    filename: "read-story-problem.jpg",
    alt: "Luke discovering a surprising story problem that begins the adventure.",
  },
  {
    number: "4",
    title: "Follow the Clues",
    image: "/images/read-story-clues.jpg",
    filename: "read-story-clues.jpg",
    alt: "Luke following visual clues through a mysterious and imaginative environment.",
  },
  {
    number: "5",
    title: "Face the Challenge",
    image: "/images/read-story-challenge.jpg",
    filename: "read-story-challenge.jpg",
    alt: "Luke and his friends facing an exciting challenge together.",
  },
  {
    number: "6",
    title: "Find the Courage",
    image: "/images/read-story-courage.jpg",
    filename: "read-story-courage.jpg",
    alt: "A warm emotional scene showing courage, friendship and determination.",
  },
  {
    number: "7",
    title: "Reach the Big Moment",
    image: "/images/read-story-big-moment.jpg",
    filename: "read-story-big-moment.jpg",
    alt: "The exciting final moment of a cinematic children's story adventure.",
  },
  {
    number: "8",
    title: "Carry the Story Home",
    image: "/images/read-story-ending.jpg",
    filename: "read-story-ending.jpg",
    alt: "A joyful story ending that leaves the reader with a memorable feeling and idea.",
  },
];

const benefits = [
  {
    image: "/images/read-icon-cinematic.png",
    alt: "Magical illustrated open storybook",
    title: "Cinematic Stories",
    text: "Beautifully illustrated adventures that feel like stepping into another world.",
  },
  {
    image: "/images/read-icon-easy.png",
    alt: "Illustrated letter card representing easy-to-read text",
    title: "Easy-to-Read Text",
    text: "Clear, approachable writing designed for growing and independent readers.",
  },
  {
    image: "/images/read-icon-characters.png",
    alt: "Friendly illustrated story characters",
    title: "Memorable Characters",
    text: "Funny, brave and lovable characters children want to follow.",
  },
  {
    image: "/images/read-icon-imagination.png",
    alt: "Glowing star representing imagination",
    title: "Big Imagination",
    text: "Unexpected worlds and mysteries that keep curiosity alive.",
  },
  {
    image: "/images/read-icon-together.png",
    alt: "Two people representing reading together",
    title: "Read Alone or Together",
    text: "Perfect for independent reading, bedtime or family story time.",
  },
  {
    image: "/images/read-icon-rewards.png",
    alt: "Golden star coin representing reading rewards",
    title: "Earn & Celebrate",
    text: "Coins, badges and streaks help children celebrate every finished story.",
  },
];

const faqItems = [
  {
    question: "What ages is Read With Luke for?",
    answer:
      "Read With Luke is designed primarily for children ages 5–10, including growing readers and children who enjoy reading with a parent.",
  },
  {
    question: "Can my child read independently?",
    answer:
      "Yes. The stories use clear text, strong visual storytelling and page-by-page reading designed to support independent readers.",
  },
  {
    question: "Can we read the stories together?",
    answer:
      "Yes. The stories work beautifully for bedtime, family reading and reading aloud together.",
  },
  {
    question: "How do coins and rewards work?",
    answer:
      "Children can earn coins, badges and reading streaks as they complete stories and return to read regularly.",
  },
  {
    question: "How often are new stories added?",
    answer:
      "New stories, continuing adventures and special reading experiences are added regularly.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Membership can be managed or canceled through the parent account.",
  },
  {
    question: "Can I read a complete story for free?",
    answer:
      "Yes. Space Rabbits: The Origin Story is available as a complete free story with no signup required.",
  },
];

function Visual({
  src = "",
  alt,
  filename,
  className = "",
}: VisualProps) {
  if (src.trim()) {
    return (
      <img
        src={src}
        alt={alt}
        className={`learnMarketingImage ${className}`}
      />
    );
  }

  return (
    <div
      className={`learnMarketingPlaceholder ${className}`}
      role="img"
      aria-label={alt}
    >
      <strong>IMAGE TO UPLOAD</strong>
      <span>{filename}</span>

      <p>
        <b>ALT:</b> {alt}
      </p>
    </div>
  );
}

function getBookCover(book: Book) {
  return book.cover_url || "/images/6to5ratio.png";
}

export default function ReadWithLukePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select(
          "id, title, slug, description, cover_url, age_range, category, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(18);

      if (error) {
        console.error(
          "Unable to load Read With Luke stories:",
          error
        );

        return;
      }

      setBooks(data || []);
    }

    loadBooks();
  }, []);

  const shelfBooks = books.slice(0, 10);
  const featuredBooks = books.slice(0, 5);

  return (
    <div className="learnMarketingPage">
      <Header />

      <main className="learnMarketingMain">
        {/* HERO AND MOVING STORY CAROUSEL */}
        <section className="learnTopPanel">
          <div className="learnHero">
            <div className="learnHeroMedia">
              <Visual
                src="/images/read-with-luke-hero.jpg"
                filename="read-with-luke-hero.jpg"
                alt="Wide cinematic scene showing Luke entering an imaginative story world filled with friendship, mystery, adventure and wonder."
              />
            </div>

            <div className="learnHeroOverlay" />

            <div className="learnHeroCopy">
              <p className="learnHeroBrand">
                Read With Luke
              </p>

              <h1>
                <span>Big Stories.</span>
                <strong>Wild Adventures.</strong>
                <em>Readers Who Want More.</em>
              </h1>

              <p className="learnHeroText">
                A growing library of cinematic children’s
                stories filled with mysteries, friendships,
                funny moments, unforgettable characters and
                incredible worlds children actually want to
                finish.
              </p>

              <div className="learnHeroActions">
                <Link
                  href="/library"
                  className="learnOrangeButton"
                >
                  Explore the Full Library
                </Link>

                <Link
                  href="/membership"
                  className="learnCreamButton"
                >
                  Start 7-Day Free Trial
                </Link>
              </div>

              <div className="learnHeroMeta">
                <span>🧒 Ages 5–10+</span>
                <span>📖 Cinematic Stories</span>
                <span>🪙 Coins &amp; Rewards</span>

                <span>
                  ✨ New Stories Added Regularly
                </span>
              </div>
            </div>
          </div>

          <div
            className="learnShelfPanel"
            id="stories"
          >
            <div className="learnCarouselHeader">
              <div>
                <p>Choose Your Next Story</p>

                <h2>
                  Explore the latest Read With Luke
                  adventures.
                </h2>
              </div>

              <Link
                href="/library"
                className="learnCarouselViewAll"
              >
                View Full Library
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="learnCarouselWindow">
              <div className="learnCarouselTrack">
                <div className="learnCarouselGroup">
                  {shelfBooks.map((book) => (
                    <Link
                      key={`first-${book.id}`}
                      href={`/books/${book.slug}`}
                      className="learnCarouselCard"
                      aria-label={`Explore ${book.title}`}
                    >
                      <img
                        src={getBookCover(book)}
                        alt={book.title}
                      />
                    </Link>
                  ))}
                </div>

                <div
                  className="learnCarouselGroup"
                  aria-hidden="true"
                >
                  {shelfBooks.map((book) => (
                    <Link
                      key={`second-${book.id}`}
                      href={`/books/${book.slug}`}
                      className="learnCarouselCard"
                      tabIndex={-1}
                    >
                      <img
                        src={getBookCover(book)}
                        alt=""
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CINEMATIC STORY SECTION */}
        <section className="learnWowSection">
          <div className="learnWowMedia">
            <Visual
              src="/images/read-with-luke-story-world.jpg"
              filename="read-with-luke-story-world.jpg"
              alt="A small child standing at the entrance to a huge magical story world filled with castles, forests, stars and distant adventures."
            />
          </div>

          <div className="learnWowShade" />

          <div className="learnWowCopy">
            <p>First,</p>

            <h2>
              We Pull Them
              <span>Into the Story.</span>
            </h2>

            <div className="learnWowStars">
              ✧　☆　✧
            </div>

            <p className="learnWowBody">
              A mysterious door.
              <br />
              A lost map.
              <br />
              A friendship that changes everything.
              <br />

              <strong>
                Reading begins when a child cannot wait
                to discover what happens next.
              </strong>
            </p>
          </div>

          <div className="learnWowDirection">
            Follow
            <br />
            Luke Into
            <br />
            the Story
            <span>↓</span>
          </div>
        </section>

        {/* HOW A STORY UNFOLDS */}
        <section className="learnTreePanel">
          <div className="learnTreeContent">
            <div className="learnTreeHeading">
              <h2>How Does a Story Come Alive?</h2>

              <p>
                From the First Page to the Final Adventure
              </p>
            </div>

            <div className="learnTreeGrid">
              {storyDiscoveries.map((item) => (
                <article key={item.number}>
                  <div className="learnTreeCardMedia">
                    <Visual
                      src={item.image}
                      filename={item.filename}
                      alt={item.alt}
                    />
                  </div>

                  <div className="learnTreeCardLabel">
                    <span>{item.number}</span>
                    <strong>{item.title}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="learnTreeNotes">
            <p>← One Unforgettable Character</p>
            <p>← A World Worth Exploring</p>
            <p>☆ Short, Clear Pages</p>
            <p>← A Story Worth Finishing</p>
          </aside>
        </section>

        {/* FEATURED STORY CARDS */}
        <section className="learnQuestionsPanel">
          <div className="learnCenteredTitle">
            <span>✦</span>

            <h2>
              Stories Kids Cannot Wait to Finish
            </h2>

            <span>✦</span>
          </div>

          <div className="learnQuestionGrid">
            {featuredBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                className="learnQuestionCard"
                aria-label={`Read ${book.title}`}
              >
                <img
                  src={getBookCover(book)}
                  alt={book.title}
                />
              </Link>
            ))}
          </div>

          <Link
            href="/library"
            className="learnQuestionsButton"
          >
            Explore These and Hundreds More!
          </Link>
        </section>

        {/* READING BENEFITS */}
        <section className="learnBenefitsPanel">
          <div className="learnCenteredTitle">
            <span>📚</span>

            <h2>
              Built for Growing Readers. Loved by Families.
            </h2>

            <span>📚</span>
          </div>

          <div className="learnBenefitsLayout">
            <div className="learnBenefitGrid">
              {benefits.map((benefit) => (
                <article key={benefit.title}>
                  <img
                    src={benefit.image}
                    alt={benefit.alt}
                    className="learnBenefitIcon"
                  />

                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="learnFaqPanel">
          <div className="learnFaqContent">
            <h2>Questions? We’ve Got Answers.</h2>

            <div className="learnFaqGrid">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <article key={item.question}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? null : index
                        )
                      }
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <b>{isOpen ? "−" : "⌄"}</b>
                    </button>

                    {isOpen && <p>{item.answer}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="learnFinalPanel">
          <div className="learnFinalMedia">
            <Visual
              src="/images/read-with-luke-final.jpg"
              filename="read-with-luke-final.jpg"
              alt="Epic cinematic scene showing Luke entering a magical world of stories, characters, mysteries and adventures."
            />
          </div>

          <div className="learnFinalCopy">
            <div>
              <Link
                href="/membership"
                className="learnOrangeButton"
              >
                Start the 7-Day Free Trial
              </Link>

              <Link
                href="/library"
                className="learnCreamButton"
              >
                Explore the Library
              </Link>
            </div>

            <span>
              Explore first. Cancel anytime.
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
