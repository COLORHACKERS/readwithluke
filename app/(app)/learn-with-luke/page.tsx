"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./learn-with-luke.css";

type LearnItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url: string | null;
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

const treeDiscoveries = [
  {
    number: "1",
    title: "Roots Hold Fast",
    image: "/images/tree-roots.jpg",
    filename: "tree-roots.jpg",
    alt: "Close cinematic view of enormous tree roots gripping dark forest soil, with smaller roots spreading outward underground.",
  },
  {
    number: "2",
    title: "The Trunk Is a Highway",
    image: "/images/tree-trunk-water.jpg",
    filename: "tree-trunk-water.jpg",
    alt: "Cross-section of a giant tree trunk showing water traveling upward through the inner wood in glowing blue channels.",
  },
  {
    number: "3",
    title: "Inside: Sapwood & Heartwood",
    image: "/images/tree-rings.jpg",
    filename: "tree-rings.jpg",
    alt: "Detailed cross-section of tree rings showing outer bark, sapwood and darker heartwood.",
  },
  {
    number: "4",
    title: "Branches Spread Out",
    image: "/images/tree-branches.jpg",
    filename: "tree-branches.jpg",
    alt: "Looking upward through the huge branches of an ancient tree as they spread toward sunlight.",
  },
  {
    number: "5",
    title: "Twigs Grow Buds",
    image: "/images/tree-buds.jpg",
    filename: "tree-buds.jpg",
    alt: "Close-up of new buds growing from twigs with warm sunlight in the forest.",
  },
  {
    number: "6",
    title: "Leaves Make Food",
    image: "/images/tree-leaves-food.jpg",
    filename: "tree-leaves-food.jpg",
    alt: "Bright green leaves receiving sunlight and making food for the tree.",
  },
  {
    number: "7",
    title: "The Crown Reaches High",
    image: "/images/tree-crown.jpg",
    filename: "tree-crown.jpg",
    alt: "The high crown of a giant tree reaching above the forest into bright sunlight.",
  },
  {
    number: "8",
    title: "All the Parts Work Together",
    image: "/images/tree-whole-system.jpg",
    filename: "tree-whole-system.jpg",
    alt: "Full giant tree showing roots, trunk, branches and leaves working together.",
  },
];

const benefits = [
  {
    icon: "📖",
    title: "Short & Engaging Text",
    text: "Perfect for ages 5–10+ with big pictures and approachable words.",
  },
  {
    icon: "🌎",
    title: "Real Knowledge",
    text: "Supported by real information and beautifully told visual stories.",
  },
  {
    icon: "Aa",
    title: "Vocabulary in Context",
    text: "New words are introduced naturally with clear visual explanations.",
  },
  {
    icon: "💡",
    title: "Critical Thinking",
    text: "Encourages observation, questions and big ideas.",
  },
  {
    icon: "👨‍👩‍👦",
    title: "Independent or Together",
    text: "Explore independently or enjoy learning together as a family.",
  },
  {
    icon: "🏅",
    title: "Earn & Celebrate",
    text: "Coins, stickers and streaks reward curiosity and progress.",
  },
];

const faqItems = [
  {
    question: "What ages is Learn With Luke for?",
    answer:
      "Learn With Luke is designed primarily for curious children ages 5–10.",
  },
  {
    question: "Can my child explore independently?",
    answer:
      "Yes. The adventures use clear text, strong visuals and focused explanations that children can explore alone or with a grown-up.",
  },
  {
    question: "How do coins and adventures work?",
    answer:
      "Children can earn coins and rewards as they complete stories and learning adventures.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Membership can be managed or canceled through the parent account.",
  },
  {
    question: "What does a learning adventure include?",
    answer:
      "Each adventure begins with a surprising visual, follows one focused question and ends with a clear explanation.",
  },
  {
    question: "How often are new adventures added?",
    answer:
      "New learning adventures and continuing topics are added regularly.",
  },
  {
    question: "Can I read one for free?",
    answer:
      "Yes. The Moon’s Secret Powers: Part 2 is available as a complete free learning adventure.",
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

function getLearnCover(item: LearnItem) {
  return (
    item.cover_url ||
    item.image_url ||
    "/images/6to5ratio.png"
  );
}

export default function LearnWithLukePage() {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase
        .from("learn_items")
        .select("*")
        .eq("is_published", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(18);

      if (error) {
        console.error(
          "Unable to load learning adventures:",
          error
        );

        return;
      }

      setItems(data || []);
    }

    loadItems();
  }, []);

  const shelfItems = items.slice(0, 10);
  const questionItems = items.slice(0, 5);

  return (
    <div className="learnMarketingPage">
      <Header />

      <main className="learnMarketingMain">
        {/* HERO AND 10-ITEM CAROUSEL */}
      <section className="learnTopPanel">
  <div className="learnHero">
    <div className="learnHeroMedia">
      <Visual
        src="/images/learn-with-luke-hero.jpg"
        filename="learn-with-luke-hero.jpg"
        alt="Wide cinematic scene showing Luke on the right in a dramatic world combining snowy mountains, lightning, clouds, forest plants and distant discoveries."
      />
    </div>

    <div className="learnHeroOverlay" />

    <div className="learnHeroCopy">
      <p className="learnHeroBrand">
        Learn With Luke
      </p>

      <h1>
        <span>Big Questions.</span>
        <strong>Wild Adventures.</strong>
        <em>Real Understanding.</em>
      </h1>

      <p className="learnHeroText">
        A growing library of cinematic learning
        adventures that helps curious kids ages
        5–10 explore space, animals, oceans,
        weather, forests, the human body,
        everyday mysteries and more.
      </p>

      <div className="learnHeroActions">
        <Link
          href="/learn"
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
        <span>🎬 Cinematic Reading</span>
        <span>🪙 Coins &amp; Stickers</span>
        <span>
          ✨ New Adventures Added Regularly
        </span>
      </div>
    </div>
  </div>

  <div
    className="learnShelfPanel"
    id="adventures"
  >
    <div className="learnCarouselHeader">
      <div>
        <p>Choose Your Next Adventure</p>

        <h2>
          Explore the latest Learn With Luke adventures.
        </h2>
      </div>

      <Link
        href="/learn"
        className="learnCarouselViewAll"
      >
        View Full Library
        <span aria-hidden="true">→</span>
      </Link>
    </div>

    <div className="learnCarouselWindow">
      <div className="learnCarouselTrack">
        <div className="learnCarouselGroup">
          {shelfItems.map((item) => (
            <Link
              key={`first-${item.id}`}
              href={`/learn/${item.slug}`}
              className="learnCarouselCard"
              aria-label={`Explore ${item.title}`}
            >
              <img
                src={getLearnCover(item)}
                alt={item.title}
              />
            </Link>
          ))}
        </div>

        <div
          className="learnCarouselGroup"
          aria-hidden="true"
        >
          {shelfItems.map((item) => (
            <Link
              key={`second-${item.id}`}
              href={`/learn/${item.slug}`}
              className="learnCarouselCard"
              tabIndex={-1}
            >
              <img
                src={getLearnCover(item)}
                alt=""
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* WOW SECTION */}
        <section className="learnWowSection">
          <div className="learnWowMedia">
            <Visual
              src="/images/learn-wow-giant-tree.jpg"
              filename="learn-wow-giant-tree.jpg"
              alt="A small child explorer standing at the base of an impossibly enormous ancient tree in a glowing cinematic forest."
            />
          </div>

          <div className="learnWowShade" />

          <div className="learnWowCopy">
            <p>First,</p>

            <h2>
              We Make Them Say
              <span>“Wow.”</span>
            </h2>

            <div className="learnWowStars">
              ✧　☆　✧
            </div>

            <p className="learnWowBody">
              A towering tree. A glowing sea.
              <br />
              A storm forming overhead.
              <br />
              A volcano surrounded by rings.
              <br />

              <strong>
                Learning begins when something feels
                too amazing to ignore.
              </strong>
            </p>
          </div>

          <div className="learnWowDirection">
            Follow
            <br />
            Luke Into
            <br />
            the Question
            <span>↓</span>
          </div>
        </section>

        {/* TREE EXPLAINER */}
        <section className="learnTreePanel">
          <div className="learnTreeIntro">
            <p className="learnOrangeEyebrow">
              Start With Wonder. End With “I Get It.”
            </p>

            <h2>
              A child first sees one enormous living
              giant.
            </h2>

            <p>
              Then Luke explores how every part works
              together to keep the tree alive.
            </p>

            <div className="learnJourney">
              <div>
                <span>◉</span>
                <strong>Wow</strong>
              </div>

              <b>→</b>

              <div>
                <span>⌕</span>
                <strong>Wonder</strong>
              </div>

              <b>→</b>

              <div>
                <span>▤</span>
                <strong>Explore</strong>
              </div>

              <b>→</b>

              <div>
                <span>💡</span>
                <strong>Understand</strong>
              </div>
            </div>
          </div>

          <div className="learnTreeContent">
            <div className="learnTreeHeading">
              <h2>
                What Are the Parts of a Tree?
              </h2>

              <p>
                Exploring a Living Giant From Roots to
                Crown
              </p>
            </div>

            <div className="learnTreeGrid">
              {treeDiscoveries.map((item) => (
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
            <p>← One Focused Question</p>
            <p>
              ← Connected Visual Discoveries
            </p>
            <p>☆ Short Explanations</p>
            <p>
              ← A Clear Final Understanding
            </p>
          </aside>
        </section>

        {/* QUESTION CARDS */}
        <section className="learnQuestionsPanel">
          <div className="learnCenteredTitle">
            <span>✦</span>

            <h2>
              The Questions Kids Already Want Answered
            </h2>

            <span>✦</span>
          </div>

          <div className="learnQuestionGrid">
            {questionItems.map((item) => (
              <Link
                key={item.id}
                href={`/learn/${item.slug}`}
                className="learnQuestionCard"
              >
                <img
                  src={getLearnCover(item)}
                  alt={item.title}
                />
                
              </Link>
            ))}
          </div>

          <Link
            href="/learn"
            className="learnQuestionsButton"
          >
            Explore These and Hundreds More!
          </Link>
        </section>

        {/* BENEFITS */}
        <section className="learnBenefitsPanel">
          <div className="learnCenteredTitle">
            <span>🌿</span>

            <h2>
              Built for Curious Kids. Loved by Parents.
            </h2>

            <span>🌿</span>
          </div>

          <div className="learnBenefitsLayout">
            <div className="learnBenefitGrid">
              {benefits.map((benefit) => (
                <article key={benefit.title}>
                  <span>{benefit.icon}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>

            <article className="learnGrowingCard">
              <div>
                <p>Always Growing</p>

                <h3>
                  New Adventures Added Regularly
                </h3>

                <span>
                  There is always something new to
                  explore.
                </span>
              </div>

              <div className="learnGrowingMedia">
                <Visual
                  src="/images/learn-always-growing.png"
                  filename="learn-always-growing.png"
                  alt="Three colorful Learn With Luke adventure covers leaning together."
                />
              </div>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="learnFaqPanel">
          <div className="learnFaqContent">
            <h2>
              Questions? We’ve Got Answers.
            </h2>

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

                    {isOpen && (
                      <p>{item.answer}</p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="learnFaqLuke">
            <Visual
              src="/images/learn-faq-luke.png"
              filename="learn-faq-luke.png"
              alt="Luke smiling while holding a large magnifying glass."
            />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="learnFinalPanel">
          <div className="learnFinalMedia">
            <Visual
              src="/images/learn-final-universe.jpg"
              filename="learn-final-universe.jpg"
              alt="Epic cinematic scene showing Luke looking across planets, mountains, forests, oceans and scientific discoveries."
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
                href="/learn"
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
