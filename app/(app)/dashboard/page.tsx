"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();

  const [readerName, setReaderName] = useState("Reader");
  const [avatar, setAvatar] = useState("🔥");
  const [favoriteTheme, setFavoriteTheme] = useState("Adventure");

  const finishedCount = 0;

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      const { data: child } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (child) {
        setReaderName(child.name || "Reader");
        setAvatar(child.avatar || "🔥");
        setFavoriteTheme(child.favorite_theme || "Adventure");
      }
    }

    loadDashboard();
  }, [router]);

  return (
    <>
      <Header />

      <main className="dashboardPage">
        <section className="dashboardHero">
          <img src="/images/home-hero.png" alt="" className="dashboardBg" />

          <div className="dashboardText">
            <h1>
              YOUR READING
              <br />
              ADVENTURE.
            </h1>

            <p>
              Keep reading stories, finish learnings,
              <br />
              collect rewards, and build your streak
              <br />
              every day.
            </p>
          </div>

          <div className="dashboardWelcome">
            <h2>WELCOME BACK, {readerName.toUpperCase()}!</h2>

            <div className="dashboardStats">
              <div className="dashboardStat">
                <strong>{finishedCount}</strong>
                <span>finished</span>
              </div>

              <div className="dashboardStat">
                <strong>{avatar}</strong>
                <span>reader</span>
              </div>

              <div className="dashboardStat">
                <strong>🔥</strong>
                <span>streak</span>
              </div>
            </div>
          </div>

          <section className="dashboardPanel">
            <div className="dashboardCard">
              <div>
                <h3>Continue Reading</h3>
                <p>Jump back into your latest magical story.</p>
              </div>
              <Link href="/library">Go to Library</Link>
            </div>

            <div className="dashboardCard">
              <div>
                <h3>{favoriteTheme} Books</h3>
                <p>Explore more stories picked for your reader.</p>
              </div>
              <Link href="/library">Browse Books</Link>
            </div>

            <div className="dashboardCard">
              <div>
                <h3>Rewards</h3>
                <p>Collect stickers, badges, and reading prizes.</p>
              </div>
              <Link href="/rewards">View Rewards</Link>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}