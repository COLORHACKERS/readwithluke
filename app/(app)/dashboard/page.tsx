"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./dashboard.css";

type SavedBook = {
  id: string;
  page_number?: number;
  books?: {
    title: string;
    slug: string;
    cover_url: string | null;
  }[] | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [readerName, setReaderName] = useState("Reader");
  const [avatar, setAvatar] = useState("🔥");

  const [completedCount, setCompletedCount] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

  const [continueBook, setContinueBook] = useState<SavedBook | null>(null);
  const [favorites, setFavorites] = useState<SavedBook[]>([]);
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

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
      }

      const { data: history } = await supabase
        .from("reading_history")
        .select("completed_at, coins_earned")
        .eq("user_id", user.id);

      if (history) {
        setCompletedCount(history.length);

        setCoins(
          history.reduce((sum, item) => sum + (item.coins_earned || 1), 0)
        );

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

          if (dates.includes(expected)) currentStreak++;
          else break;
        }

        setStreak(currentStreak);
      }

      const { data: bookmarks } = await supabase
        .from("book_bookmarks")
        .select("id, page_number, books(title, slug, cover_url)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(4);

    if (bookmarks) {
  setContinueBook(bookmarks[0] || null);
  setSavedBooks(bookmarks as SavedBook[]);
}

      const { data: likes } = await supabase
        .from("book_likes")
        .select("id, books(title, slug, cover_url)")
        .eq("user_id", user.id)
        .limit(4);

      if (likes) {
        setFavorites(likes as SavedBook[]);
      }
    }

    loadDashboard();
  }, [router]);
const continueBookInfo = Array.isArray(continueBook?.books)
  ? continueBook.books[0]
  : continueBook?.books;
  
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
              Keep reading stories, collect coins,
              <br />
              build your streak, and unlock rewards.
            </p>
          </div>

         <div className="dashboardWelcome">
  <div className="dashboardAvatarWrap">
    <div className="dashboardAvatar">{avatar}</div>

    <div>
      <h2>WELCOME BACK, {readerName.toUpperCase()}!</h2>
    </div>
  </div>

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
  <div className="dashboardCardIcon">📖</div>

  <div>
    <h3>Continue Reading</h3>

    {continueBookInfo ? (
      <p>
        {continueBookInfo.title}
        <br />
        Page {continueBook?.page_number || 1}
      </p>
    ) : (
      <p>Jump into your next magical story.</p>
    )}

    {continueBookInfo ? (
      <Link
        href={`/books/${continueBookInfo.slug}/read?page=${
          continueBook?.page_number || 1
        }`}
      >
        Continue
      </Link>
    ) : (
      <Link href="/library">Go to Library</Link>
    )}
  </div>
</div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">❤️</div>

              <div>
                <h3>Favorites</h3>
                <p>
                  {favorites.length > 0
                    ? `${favorites.length} favorite stories saved.`
                    : "Tap the heart on stories you love."}
                </p>

                <Link href="/library">View Library</Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">🔖</div>

              <div>
                <h3>Saved Stories</h3>
                <p>
                  {savedBooks.length > 0
                    ? `${savedBooks.length} stories saved for later.`
                    : "Use the bookmark to save a story."}
                </p>

                <Link href="/library">Browse Books</Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">🏆</div>

              <div>
                <h3>Rewards</h3>
                <p>{avatar} Build your avatar with stickers and coins.</p>

                <Link href="/rewards">Build Avatar</Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">⭐</div>

              <div>
                <h3>Stickers</h3>
                <p>Collect fun stickers as you read and learn.</p>

                <Link href="/rewards">View Stickers</Link>
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
