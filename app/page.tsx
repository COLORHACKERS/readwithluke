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
  if (!items.length) {
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

function getLearnCover(item: LearnItem) {
  return (
    item.cover_url ||
    item.image_url ||
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

  const marqueeBooks = fillToSix(books);
  const marqueeLearnItems = fillToSix(learnItems);

  const featuredBookDescription =
    featuredBook?.description ||
    "Something strange is happening, and Luke and his friends are following the clues. Can they uncover the truth before the mysterious bandit strikes again?";

  return (
    <>
      <Header />

      <main className="homePage">
        {/* HERO */}
        <section className="homeHero">
          <img
            src="/images/home-hero.png"
            alt=""
            className="homeHeroBackground"
          />

          <div className="homeHeroOverlay" />

          <div className="homeHeroInner">
            <div className="homeHeroCopy">
              <h1>
                TURN “<strong>DO I</strong>
                <br />
                HAVE TO READ?”
                <br />
                INTO “<strong>CAN I</strong> READ
                <br />
                ONE MORE?”
              </h1>

              <div className="homeHeroUnderline" />

              <p>
                Original cinematic stories and fascinating learning adventures
                for curious kids designed to make reading feel less
                like an assignment and more like an adventure.
              </p>

              <div className="homeHeroButtons">
                <Link href="/library" className="homePrimaryButton">
                  <span className="buttonIcon">▣</span>
                  Read a Free Adventure
                </Link>

                <a href="#inside" className="homeSecondaryButton">
                  <span className="playIcon">▶</span>
                  See What’s Inside
                </a>
              </div>

              <div className="homeHeroNote">
                <strong>
                  One complete story and one learning adventure free.
                </strong>
                <span>No card required.</span>
              </div>
            </div>

            {featuredBook && (
              <Link
                href={`/books/${featuredBook.slug}`}
                className="heroFeaturedBook"
              >
                <img
                  src={getBookFeatureImage(featuredBook)}
                  alt={featuredBook.title}
                />

                <div className="heroFeaturedShade" />

                <div className="heroFeaturedContent">
                  <span className="heroFeatureBadge">
                    ★ NEW READING ADVENTURE
                  </span>

                  <h2>{featuredBook.title}</h2>

                  <p>{featuredBookDescription}</p>

                  <span className="heroFeatureButton">
                    Start the Mystery
                    <span aria-hidden="true">→</span>
                  </span>

                  <div className="heroFeatureMeta">
                    <span>◉ 20 Page Story</span>
                    <span>◆ {featuredBook.age_range || "Ages 5–10"}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* LARGE CREAM HOMEPAGE PANEL */}
        <div className="homeContentShell">
          {/* TWO WORLDS */}
          <section className="homeWorldsSection">
            <div className="homeCenteredHeading">
              <span aria-hidden="true">✦</span>
              <h2>One Membership. Two Worlds to Explore.</h2>
              <span aria-hidden="true">✦</span>
            </div>

            <div className="homeWorldGrid">
              {featuredBook && (
                <Link href="/library" className="homeWorldCard">
                  <img
                    src={getBookFeatureImage(featuredBook)}
                    alt="Read With Luke"
                  />

                  <div className="homeWorldShade" />

                  <div className="homeWorldContent">
                    <h3>Read With Luke</h3>

                    <p>
                      Mysteries, friendships, funny adventures, magical worlds,
                      and heartfelt stories children actually want to finish.
                    </p>

                    <span className="homeWorldButton">
                      Explore the Stories
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              )}

              {featuredLearn && (
         <Link href="/learn" className="homeWorldCard">
  <img
    src={getLearnImage(featuredLearn)}
    alt={featuredLearn.title}
  />

                  <div className="homeWorldShade" />

                  <div className="homeWorldContent">
                    <h3>Learn With Luke</h3>

                    <p>
                      Space, weather, the human body, nature, and everyday
                      mysteries explained through fascinating visual
                      adventures.
                    </p>

                    <span className="homeWorldButton">
                      Explore What’s Waiting
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* BOOK READER PREVIEW */}
         <section className="homeInsideSection" id="inside">
  <div className="homeInsideCopy">
    <h2>
      Not Just Beautiful Covers.
    
      Whole Worlds to Read Through.
    </h2>

    <p>
      Every adventure combines easy-to-read text, cinematic artwork,
      memorable characters, and page-by-page discovery.
    </p>

    <div className="homeInsideBenefits">
      <div>
        <span className="insideBenefitIcon">▤</span>
        <strong>Cinematic Illustrations</strong>
      </div>

      <div>
        <span className="insideBenefitIcon">A</span>
        <strong>Easy-to-Read Text</strong>
      </div>

      <div>
        <span className="insideBenefitIcon">★</span>
        <strong>Fun Rewards &amp; Achievements</strong>
      </div>

      <div>
        <span className="insideBenefitIcon">♥</span>
        <strong>Safe, Ad-Free Environment</strong>
      </div>
    </div>

    {featuredBook && (
<Link
  href="/learn/the-moon-s-secret-powers-part-2/read?page=1"
  className="homeFreeStoryButton"
>
  TRY A LEARNING STORY FOR FREE!
  <span aria-hidden="true">→</span>
</Link>
    )}
  </div>

  <div className="homeIpadImageWrap">
    <img
      src="/images/ipad002.png"
      alt="Read With Luke interactive story reader"
      className="homeIpadImage"
    />
  </div>
</section>

{/* BOOK MARQUEE */}
        
          {marqueeBooks.length > 0 && (
            <section className="homeRailSection">
              <div className="homeRailHeading">
                <h2>Adventures They Can’t Wait to Read</h2>

                <Link href="/library">
                  View All
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="homeRailWindow">
                <div className="homeRailTrack">
                  {[0, 1].map((setNumber) => (
                    <div
                      className="homeRailSet"
                      key={`book-set-${setNumber}`}
                      aria-hidden={setNumber === 1}
                    >
                      {marqueeBooks.map((book, index) => (
                        <Link
                          href={`/books/${book.slug}`}
                          className="homeRailCard"
                          key={`${setNumber}-${book.id}-${index}`}
                          tabIndex={setNumber === 1 ? -1 : undefined}
                        >
                       

                          <img
                            src={getBookCover(book)}
                            alt={setNumber === 0 ? book.title : ""}
                          />

                          <div className="homeRailCardShade" />

                          
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* LEARNING MARQUEE */}
          {marqueeLearnItems.length > 0 && (
            <section className="homeRailSection homeLearningRailSection">
              <div className="homeRailHeading">
                <h2>New Things to Discover With Luke</h2>

                <Link href="/learn">
                  View All
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="homeRailWindow">
                <div className="homeRailTrack homeRailTrackReverse">
                  {[0, 1].map((setNumber) => (
                    <div
                      className="homeRailSet"
                      key={`learn-set-${setNumber}`}
                      aria-hidden={setNumber === 1}
                    >
                   {marqueeLearnItems.map((item, index) => (
  <Link
    href={`/learn/${item.slug}/read`}
    className="homeRailCard"
    key={`${setNumber}-${item.id}-${index}`}
    tabIndex={setNumber === 1 ? -1 : undefined}
  >
    <img
      src={getLearnCover(item)}
      alt={setNumber === 0 ? item.title : ""}
    />
  </Link>
))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
        {/* BENEFITS STRIP */}
        <section className="homeTrustSection">
          <div className="homeTrustInner">
            <h2>
              Screen Time
              <br />
              You Can Feel Good About
            </h2>

            <div className="homeTrustGrid">
              <div className="homeTrustItem">
                <span>★</span>

                <p>
                  <strong>Original Content</strong>
                  Created for Ages 5–10
                </p>
              </div>

              <div className="homeTrustItem">
                <span>×</span>

                <p>
                  <strong>No Third-Party</strong>
                  Advertising
                </p>
              </div>

              <div className="homeTrustItem">
                <span>●</span>

                <p>
                  <strong>Parent-Managed</strong>
                  Accounts
                </p>
              </div>

              <div className="homeTrustItem">
                <span>▣</span>

                <p>
                  <strong>New Adventures</strong>
                  Added Regularly
                </p>
              </div>

              <div className="homeTrustItem">
                <span>▤</span>

                <p>
                  <strong>Stories &amp; Learning</strong>
                  In One Membership
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section className="homeMembershipSection">
          <div className="homeMembershipIntro">
            <h2>
              Start With One
              <br />
              Adventure.
              <br />
              Join When They Ask
              <br />
              For the Next One.
            </h2>

            <div className="membershipUnderline" />
          </div>

          <div className="homePlanCard freePlanCard">
            <span className="homePlanLabel">Free Reader</span>

            <ul>
              <li>One complete Read With Luke story</li>
              <li>One complete Learn With Luke adventure</li>
              <li>No payment information required</li>
            </ul>

            <Link href="/signup" className="freePlanButton">
              Start Reading Free
            </Link>
          </div>

          <div className="homePlanCard paidPlanCard">
            <span className="homePlanLabel">Full Membership</span>

            <div className="paidPlanContent">
              <ul>
                <li>Unlimited access to all stories</li>
                <li>Unlimited learning adventures</li>
                <li>New releases and continuing series</li>
                <li>Family reading progress and rewards</li>
              </ul>

              <div className="homePlanPrices">
                <strong>
                  $9.99
                  <small>/month</small>
                </strong>

                <span>or</span>

                <strong>
                  $69.99
                  <small>/year</small>
                </strong>
              </div>
            </div>

            <Link href="/signup" className="paidPlanButton">
              Join Today
            </Link>
          </div>

          <Link href="/gift" className="homeGiftCard">
            <span className="giftEmoji">🎁</span>

            <strong>Gift Reading</strong>

            <p>
              Make storytime happen—even when you’re not there.
            </p>

            <span>
              Give a Gift
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
