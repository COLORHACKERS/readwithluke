"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./learn.css";

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

type VisualPlaceholderProps = {
  src?: string;
  alt: string;
  className?: string;
};

const categories = [
  {
    label: "Space & Sky",
    icon: "🪐",
  },
  {
    label: "Wild Earth",
    icon: "🌿",
  },
  {
    label: "Ocean Worlds",
    icon: "🌊",
  },
  {
    label: "Animals",
    icon: "🐾",
  },
  {
    label: "The Human Body",
    icon: "🫀",
  },
  {
    label: "How Things Work",
    icon: "⚙️",
  },
  {
    label: "Everyday Mysteries",
    icon: "❓",
  },
  {
    label: "Tiny Science",
    icon: "🔬",
  },
  {
    label: "Big Questions",
    icon: "💡",
  },
];

const learningSteps = [
  {
    number: "1",
    title: "Wow",
    text: "Begin with a cinematic moment that immediately captures attention.",
  },
  {
    number: "2",
    title: "Wonder",
    text: "Turn that first reaction into one focused question.",
  },
  {
    number: "3",
    title: "Explore",
    text: "Follow Luke through visual discoveries and connected ideas.",
  },
  {
    number: "4",
    title: "Understand",
    text: "Finish with a clear explanation children can remember.",
  },
];

const benefits = [
  {
    icon: "📖",
    title: "Short & Engaging Text",
    text: "Perfect for children ages 5–10, with approachable words and clear explanations.",
  },
  {
    icon: "🌎",
    title: "Real Knowledge",
    text: "Supported by factual information and beautifully told visual stories.",
  },
  {
    icon: "Aa",
    title: "Vocabulary in Context",
    text: "New words are introduced naturally, with simple explanations.",
  },
  {
    icon: "💡",
    title: "Critical Thinking",
    text: "Encourages observation, questions and big ideas.",
  },
  {
    icon: "👨‍👩‍👦",
    title: "Independent or Together",
    text: "Children can explore alone or share family learning time.",
  },
  {
    icon: "🏅",
    title: "Earn & Celebrate",
    text: "Coins, stickers and reading streaks help celebrate progress.",
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
      "Yes. The stories use clear text, strong visuals and focused explanations that children can explore independently or with a grown-up.",
  },
  {
    question: "How often are new adventures added?",
    answer:
      "New learning adventures and continuing topics are added regularly.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Membership can be managed or canceled from the parent account.",
  },
  {
    question: "How does a learning adventure work?",
    answer:
      "Each adventure begins with a surprising visual moment, follows one clear question and ends with an understandable explanation.",
  },
  {
    question: "Can I read one for free?",
    answer:
      "Yes. The Moon’s Secret Powers: Part 2 is available as a complete free learning adventure with no signup required.",
  },
];

function VisualPlaceholder({
  src = "",
  alt,
  className = "",
}: VisualPlaceholderProps) {
  if (src.trim()) {
    return (
      <img
        src={src}
        alt={alt}
        className={`learnVisualImage ${className}`}
      />
    );
  }

  return (
    <div
      className={`learnVisualPlaceholder ${className}`}
      role="img"
      aria-label={alt}
    >
      <span>IMAGE TO UPLOAD</span>
      <p>
        <strong>ALT:</strong> {alt}
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

export default function LearnPage() {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLearnItems() {
      const { data, error } = await supabase
        .from("learn_items")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error(
          "Unable to load Learn With Luke adventures:",
          error
        );
        return;
      }

      setItems(data || []);
    }

    loadLearnItems();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatches =
        activeCategory === "All" ||
        item.category === activeCategory;

      const searchMatches =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [items, activeCategory, search]);

  const featuredItems = filteredItems.slice(0, 6);
  const questionItems = items.slice(0, 5);

  return (
    <div className="learnPage">
      <Header />

      <main className="learnMain">
        {/* HERO */}
        <section className="learnHero">
          <div className="learnHeroBackground">
            <VisualPlaceholder
              src=""
              alt="Cinematic wide landscape showing Luke standing confidently in a dramatic world that blends a frozen mountain, storm clouds, a green forest, ocean waves and distant planets. Luke should be centered slightly right, smiling and inviting children into the adventure."
            />
          </div>

          <div className="learnHeroOverlay" />

          <div className="learnHeroCopy">
            <p className="learnEyebrow">
              LEARN WITH LUKE
            </p>

            <h1>
              Big Questions.
              <span>Wild Adventures.</span>
              <em>Real Understanding.</em>
            </h1>

            <p className="learnHeroDescription">
              A growing library of cinematic learning adventures
              that helps curious children ages 5–10 explore space,
              animals, oceans, weather, forests, the human body,
              everyday mysteries and more.
            </p>

            <div className="learnHeroButtons">
              <a href="#adventures" className="learnPrimaryButton">
                Explore the Full Library
              </a>

              <Link
                href="/membership"
                className="learnSecondaryButton"
              >
                Start 7-Day Free Trial
              </Link>
            </div>

            <div className="learnHeroDetails">
              <span>🧒 Ages 5–10</span>
              <span>🎬 Cinematic Visual Lessons</span>
              <span>🪙 Coins & Stickers</span>
              <span>✨ New Adventures Added Regularly</span>
            </div>
          </div>
        </section>

        {/* DISCOVERY LIBRARY */}
        <section
          className="learnDiscoverySection"
          id="adventures"
        >
          <div className="learnSectionHeading">
            <p>CHOOSE YOUR NEXT ADVENTURE</p>

            <h2>
              What Are You Curious About?
            </h2>
          </div>

          <div className="learnDiscoveryLayout">
            <aside className="learnDiscoverySidebar">
              <label htmlFor="learn-search">
                Search Adventures
              </label>

              <input
                id="learn-search"
                type="search"
                placeholder="What are you curious about?"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className={
                  activeCategory === "All"
                    ? "isActive"
                    : ""
                }
              >
                All Adventures
                <span>→</span>
              </button>

              <Link href="/learn">
                New Adventures
                <span>→</span>
              </Link>

              <Link href="/free-reads">
                Try a Free Adventure
                <span>→</span>
              </Link>
            </aside>

            <div className="learnAdventureGrid">
              {featuredItems.map((item) => (
                <Link
                  href={`/learn/${item.slug}`}
                  className="learnAdventureCard"
                  key={item.id}
                >
                  <img
                    src={getLearnCover(item)}
                    alt={item.title}
                  />

                  <div className="learnAdventureShade" />

                  <div className="learnAdventureTitle">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="learnCategoryRail">
            {categories.map((category) => (
              <button
                type="button"
                key={category.label}
                onClick={() =>
                  setActiveCategory(category.label)
                }
                className={
                  activeCategory === category.label
                    ? "isActive"
                    : ""
                }
              >
                <span>{category.icon}</span>
                <strong>{category.label}</strong>
              </button>
            ))}
          </div>
        </section>

        {/* WOW SECTION */}
        <section className="learnWowSection">
          <div className="learnWowBackground">
            <VisualPlaceholder
              src=""
              alt="A small child explorer standing at the base of an enormous ancient tree in a cinematic glowing forest. The tree should feel impossibly tall, with sunbeams, visible roots and floating golden particles creating a powerful sense of wonder."
            />
          </div>

          <div className="learnWowOverlay" />

          <div className="learnWowCopy">
            <p>FIRST,</p>

            <h2>
              We Make Them Say
              <span>“Wow.”</span>
            </h2>

            <p className="learnWowDescription">
              A towering tree. A glowing sea. A storm forming
              overhead. We begin with something that feels too
              amazing to ignore.
            </p>
          </div>

          <div className="learnWowPrompt">
            Follow Luke into the question
            <span>↓</span>
          </div>
        </section>

        {/* HOW LEARNING WORKS */}
        <section className="learnMethodSection">
          <div className="learnMethodIntro">
            <p>START WITH WONDER. END WITH “I GET IT.”</p>

            <h2>
              One Focused Question.
              <br />
              Connected Visual Discoveries.
            </h2>

            <span>
              Children first see one unforgettable moment.
              Then Luke explores how every part works together
              to explain the big idea.
            </span>

            <div className="learnMethodSteps">
              {learningSteps.map((step) => (
                <div key={step.number}>
                  <span>{step.number}</span>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <VisualPlaceholder
            src=""
            className="learnMethodVisual"
            alt="Eight connected illustrated learning panels explaining the parts of a giant tree: roots holding fast, the trunk carrying water, bark and heartwood, branches reaching sunlight, twigs growing buds, leaves making food, the crown reaching high and all parts working together."
          />
        </section>

        {/* QUESTION CARDS */}
        <section className="learnQuestionsSection">
          <div className="learnCenteredHeading">
            <span>✦</span>
            <h2>
              The Questions Kids Already Want Answered
            </h2>
            <span>✦</span>
          </div>

          <div className="learnQuestionGrid">
            {questionItems.map((item) => (
              <Link
                href={`/learn/${item.slug}`}
                className="learnQuestionCard"
                key={item.id}
              >
                <img
                  src={getLearnCover(item)}
                  alt={item.title}
                />

                <div className="learnQuestionShade" />

                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>

          <Link href="/learn" className="learnExploreButton">
            Explore These and Hundreds More
          </Link>
        </section>

        {/* BENEFITS */}
        <section className="learnBenefitsSection">
          <div className="learnCenteredHeading">
            <span>🌿</span>
            <h2>
              Built for Curious Kids. Loved by Parents.
            </h2>
            <span>🌿</span>
          </div>

          <div className="learnBenefitGrid">
            {benefits.map((benefit) => (
              <article
                className="learnBenefitItem"
                key={benefit.title}
              >
                <span>{benefit.icon}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}

            <article className="learnGrowingCard">
              <div>
                <p>ALWAYS GROWING</p>

                <h3>
                  New Adventures Added Regularly
                </h3>

                <span>
                  There is always something new waiting to explore.
                </span>
              </div>

              <VisualPlaceholder
                src=""
                alt="A small stack of three colorful Learn With Luke adventure covers leaning together, with Luke peeking up from the bottom corner and holding a magnifying glass."
              />
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="learnFaqSection">
          <div className="learnFaqContent">
            <p>QUESTIONS? WE’VE GOT ANSWERS.</p>

            <div className="learnFaqGrid">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <article
                    className="learnFaqItem"
                    key={item.question}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <span>{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && <p>{item.answer}</p>}
                  </article>
                );
              })}
            </div>
          </div>

          <VisualPlaceholder
            src=""
            className="learnFaqLuke"
            alt="Luke smiling and kneeling while holding a large magnifying glass, looking toward the FAQ questions."
          />
        </section>

        {/* FINAL CTA */}
        <section className="learnFinalCta">
          <div className="learnFinalBackground">
            <VisualPlaceholder
              src=""
              alt="Epic cinematic final scene showing Luke from behind, standing on a cliff and looking across a vast world filled with planets, a rocket, oceans, glowing forests, mountains, animals and scientific discoveries."
            />
          </div>

          <div className="learnFinalOverlay" />

          <div className="learnFinalContent">
            <p>
              Your Child Already Asks
              <em>Big Questions.</em>
            </p>

            <h2>
              Give Them a Place to Chase Every One.
            </h2>

            <div>
              <Link
                href="/membership"
                className="learnPrimaryButton"
              >
                Start the 7-Day Free Trial
              </Link>

              <a
                href="#adventures"
                className="learnSecondaryButton"
              >
                Explore the Library
              </a>
            </div>

            <span>Explore first. Cancel anytime.</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
