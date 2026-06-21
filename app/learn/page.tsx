"use client";

import { useEffect, useState } from "react";
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
};

export default function LearnPage() {
  const [items, setItems] = useState<LearnItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("learn_items")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data || []);
  }

  const featured = items[0];

  return (
    <>
      <Header />

      <main className="learnPage">
        <img src="/images/home-hero.png" alt="" className="learnBg" />

        <section className="learnHero">
          <div className="learnHeroText">
            <h1>
              LEARN
              <br />
              SOMETHING
              <br />
              AWESOME.
            </h1>

            <p>
              Fun facts, science, animals, space, history,
              <br />
              and amazing things explained like a comic.
            </p>
          </div>

          {featured && (
            <Link href={`/learn/${featured.slug}`} className="featuredLearn">
              <img
                src={
                  featured.cover_url ||
                  featured.image_url ||
                  "/images/6to5ratio.png"
                }
                alt={featured.title}
              />

              <div className="featuredOverlay">
                <span>FEATURED LEARNING</span>
                <h2>{featured.title}</h2>
                <p>
                  {featured.description ||
                    "Open this learning adventure and discover something new."}
                </p>
                <strong>LEARN NOW</strong>
              </div>
            </Link>
          )}
        </section>

        <section className="learnRail">
          <h2>New Learning Adventures</h2>

          <div className="learnScroller">
            {items.map((item) => (
              <Link
                href={`/learn/${item.slug}`}
                className="learnTile"
                key={item.id}
              >
                <img
                  src={item.cover_url || item.image_url || "/images/6to5ratio.png"}
                  alt={item.title}
                />

                <div className="learnTileOverlay">
                  <h3>{item.title}</h3>
                  <p>{item.category || "Learn with Luke"}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="suggestBox">
          <input placeholder="submit something you want to learn." />

          <button>
            <img src="/images/icon-send.png" alt="" />
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}