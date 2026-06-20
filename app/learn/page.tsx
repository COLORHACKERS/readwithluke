"use client";

import { useEffect, useState } from "react";
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

  return (
    <>
      <Header />

      <main className="learnPage">
        <img src="/images/home-hero.png" alt="" className="learnBg" />

        <section className="learnHero">
          <h1>PICK SOMETHING FUN TO LEARN.</h1>
          <p>Learn with Luke Library &gt;</p>
        </section>

        <section className="learnGrid">
          {items.map((item) => (
            <article className="learnCard" key={item.id}>
              <img
                src={item.cover_url || item.image_url || "/images/6to5ratio.png"}
                alt={item.title}
                className="learnCardImage"
              />

              <div className="learnCardBody">
                <h2>{item.title}</h2>

                <p>{item.description || "Learn something fun with Luke."}</p>

                <div className="learnCardActions">
                  <button type="button">
                    <img src="/images/heart.png" alt="" />
                  </button>

                  <a href={`/learn/${item.slug}`} className="learnBtn">
                    LEARN
                  </a>

                  <button type="button">
                    <img src="/images/bookmark.png" alt="" />
                  </button>
                </div>
              </div>
            </article>
          ))}
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