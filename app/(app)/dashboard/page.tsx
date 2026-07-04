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

  const [completedCount, setCompletedCount] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

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

      const { data: history } = await supabase
        .from("reading_history")
        .select("completed_at, coins_earned")
        .eq("user_id", user.id);

      if (history) {
        setCompletedCount(history.length);

        const totalCoins = history.reduce(
          (sum, item) => sum + (item.coins_earned || 1),
          0
        );

        setCoins(totalCoins);

        const dates = Array.from(
          new Set(
            history.map((item) =>
              new Date(item.completed_at).toISOString().slice(0, 10)
            )
          )
        ).sort((a, b) => b.localeCompare(a));

        let currentStreak = 0;
        const today = new Date();

        for (let i = 0; i < dates.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const expected = checkDate.toISOString().slice(0, 10);

          if (dates.includes(expected)) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
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
              Keep reading stories, finish learning adventures,
              <br />
              collect coins, and build your streak every day.
            </p>
          </div>

          <div className="dashboardWelcome">
            <h2>WELCOME BACK, {readerName.toUpperCase()}!</h2>

            <div className="dashboardStats">
              <div className="dashboardStat">
                <strong>🪙 {coins}</strong>
                <span>coins</span>
              </div>

              <div className="dashboardStat">
                <strong>{completedCount}</strong>
                <span>completed</span>
              </div>

              <div className="dashboardStat">
                <strong>🔥 {streak}</strong>
                <span>day streak</span>
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
                <p>{avatar} Collect badges, coins, and reading prizes.</p>
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
