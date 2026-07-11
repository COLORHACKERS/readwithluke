
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./home-learn-feature.css";

type LearnItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url: string | null;
  category: string | null;
};

export default function HomeLearnFeature() {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLearnItems() {
      const { data, error } = await supabase
        .from("learn_items")
        .select(
          "id, title, slug, description, cover_url, image_url, category"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(2);

      if (error) {
        console.error("Homepage learn items error:", error);
        setLoading(false);
        return;
      }

      setItems(data || []);
      setLoading(false);
    }

    loadLearnItems();
  }, []);

  if (loading) {
    return (
      <section className="homeLearnSection">
        <p className="homeLearnLoading">Loading learning adventures...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const featured = items[0];
  const latest = items[1];

  return (
    <section className="homeLearnSection">
      <div className="homeLearnHeading">
        <div>
          <p className="homeLearnEyebrow">LEARN WITH LUKE</p>
          <h2>Discover Something Amazing</h2>
        </div>

        <Link href="/learn" className="homeLearnViewAll">
          VIEW ALL LEARNING →
        </Link>
      </div>

      <div
        className={`homeLearnGrid ${
          latest ? "homeLearnGridTwo" : "homeLearnGridOne"
        }`}
      >
        <Link
          href={`/learn/${featured.slug}`}
          className="homeLearnFeatured"
        >
          <img
            src={
              featured.image_url ||
              featured.cover_url ||
              "/images/learn-placeholder.png"
            }
            alt={featured.title}
          />

          <div className="homeLearnOverlay" />

          <div className="homeLearnFeaturedContent">
            <span>{featured.category || "Learning Adventure"}</span>

            <h3>{featured.title}</h3>

            <p>
              {featured.description ||
                "Explore fascinating ideas, surprising facts, and new discoveries with Luke."}
            </p>

            <strong>START LEARNING →</strong>
          </div>
        </Link>

        {latest && (
          <Link
            href={`/learn/${latest.slug}`}
            className="homeLearnLatest"
          >
            <div className="homeLearnLatestImage">
              <img
                src={
                  latest.cover_url ||
                  latest.image_url ||
                  "/images/learn-placeholder.png"
                }
                alt={latest.title}
              />
            </div>

            <div className="homeLearnLatestContent">
              <span>LATEST LEARNING</span>

              <h3>{latest.title}</h3>

              <p>
                {latest.description ||
                  "Join Luke for another exciting learning adventure."}
              </p>

              <strong>EXPLORE →</strong>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
