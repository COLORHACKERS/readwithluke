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
};

export default function LearnPage() {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [page, setPage] = useState(1);

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

  const filteredItems = useMemo(() => items, [items]);

  const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const visibleItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const featured = filteredItems[0];

  return (
    <>
      <Header />

      <main className="learnPage">
        <img src="/images/home-hero.png" alt="" className="learnBg" />

        <section className="learnHero">
          <div className="learnHeroText">
            <h1>
              LEARN.
              <br />
              DISCOVER.
              <br />
              EXPLORE.
            </h1>

            <p>
              Fun facts, science, animals, space,
              <br />
              history, oceans, dinosaurs, and awesome
              <br />
              things explained like a comic.
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
            {visibleItems.map((item) => (
         <Link
  href={`/learn/${item.slug}`}
  className="learnTile"
  key={item.id}
>
  <img
    className="learnCover"
    src={item.cover_url || item.image_url || "/images/6to5ratio.png"}
    alt={item.title}
  />

</Link>
            ))}
          </div>
        </section>

        {totalPages > 1 && (
          <section className="learnPagination">
            <button
              type="button"
              className="learnPageArrow"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                type="button"
                key={index}
                className={page === index + 1 ? "active" : ""}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="learnPageArrow"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              →
            </button>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
