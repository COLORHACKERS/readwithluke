"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./free-reads.css";

type FreeReadItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url?: string | null;
};

const FREE_BOOK_SLUG =
  "space-rabbits-the-origin-story";

const FREE_LEARN_SLUG =
  "the-moon-s-secret-powers-part-2";

export default function FreeReadsPage() {
  const [book, setBook] =
    useState<FreeReadItem | null>(null);

  const [learnItem, setLearnItem] =
    useState<FreeReadItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadFreeReads() {
      const [bookResponse, learnResponse] =
        await Promise.all([
          supabase
            .from("books")
            .select(
              "id, title, slug, description, cover_url, image_url"
            )
            .eq("slug", FREE_BOOK_SLUG)
            .eq("is_published", true)
            .maybeSingle<FreeReadItem>(),

          supabase
            .from("learn_items")
            .select(
              "id, title, slug, description, cover_url, image_url"
            )
            .eq("slug", FREE_LEARN_SLUG)
            .eq("is_published", true)
            .maybeSingle<FreeReadItem>(),
        ]);

      if (bookResponse.error) {
        console.error(
          "Unable to load free book:",
          bookResponse.error
        );
      } else {
        setBook(bookResponse.data);
      }

      if (learnResponse.error) {
        console.error(
          "Unable to load free learning story:",
          learnResponse.error
        );
      } else {
        setLearnItem(learnResponse.data);
      }

      setLoading(false);
    }

    loadFreeReads();
  }, []);

  function getImage(item: FreeReadItem) {
    return (
      item.cover_url ||
      item.image_url ||
      "/images/6to5ratio.png"
    );
  }

  return (
    <div className="freeReadsPage">
      <Header />

      <main className="freeReadsMain">
        <section className="freeReadsHero">
          <p className="freeReadsEyebrow">
            NO SIGNUP. NO CARD. JUST READ.
          </p>

          <h1>
            Two Free Adventures
            <span>Waiting for You!</span>
          </h1>

          <p className="freeReadsIntro">
            Read one complete story and one complete
            learning adventure with Luke. These two
            adventures are completely free and do not
            require an account.
          </p>

          <div className="freeReadsHighlights">
            <span>✓ Complete stories</span>
            <span>✓ No signup required</span>
            <span>✓ No payment information</span>
          </div>
        </section>

        {loading ? (
          <div className="freeReadsLoading">
            Loading your free adventures...
          </div>
        ) : (
          <section className="freeReadsGrid">
            {book && (
              <article className="freeReadCard">
                <div className="freeReadImageWrap">
                  <img
                    src={getImage(book)}
                    alt={book.title}
                  />

                  <span className="freeReadBadge">
                    FREE READING ADVENTURE
                  </span>
                </div>

                <div className="freeReadCardContent">
                  <p className="freeReadType">
                    READ WITH LUKE
                  </p>

                  <h2>{book.title}</h2>

                  <p>
                    {book.description ||
                      "Join Luke for a complete imaginative reading adventure."}
                  </p>

                  <Link
                    href={`/books/${book.slug}/read`}
                    className="freeReadButton"
                  >
                    Read the Full Story
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )}

            {learnItem && (
              <article className="freeReadCard">
                <div className="freeReadImageWrap">
                  <img
                    src={getImage(learnItem)}
                    alt={learnItem.title}
                  />

                  <span className="freeReadBadge">
                    FREE LEARNING ADVENTURE
                  </span>
                </div>

                <div className="freeReadCardContent">
                  <p className="freeReadType">
                    LEARN WITH LUKE
                  </p>

                  <h2>{learnItem.title}</h2>

                  <p>
                    {learnItem.description ||
                      "Explore a complete learning adventure with Luke."}
                  </p>

                  <Link
                    href={`/learn/${learnItem.slug}/read?page=1`}
                    className="freeReadButton"
                  >
                    Start Learning
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )}
          </section>
        )}

        <section className="freeReadsMembership">
          <div>
            <p>READY FOR MORE?</p>

            <h2>
              Unlock Every Story and Learning Adventure
            </h2>

            <span>
              Continue exploring with unlimited access
              to Read With Luke and Learn With Luke.
            </span>
          </div>

          <Link
            href="/membership"
            className="freeReadsMembershipButton"
          >
            Explore Membership
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
