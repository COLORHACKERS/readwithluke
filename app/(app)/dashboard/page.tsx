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

type AvatarConfig = {
  skin: string;
  hair: string;
  hairColor: string;
  shirt: string;
  pants: string;
  accessory: string;
};

const DEFAULT_AVATAR: AvatarConfig = {
  skin: "medium",
  hair: "curly",
  hairColor: "black",
  shirt: "orange",
  pants: "jeans",
  accessory: "none",
};

type Child = {
  id: string;
  name: string;
  avatar: string | null;
  avatar_config: AvatarConfig | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [readerName, setReaderName] =
    useState("Reader");

  const [avatar, setAvatar] =
    useState("🔥");
  const [avatarConfig, setAvatarConfig] =
  useState<AvatarConfig>(
    DEFAULT_AVATAR
  );

  const [children, setChildren] =
    useState<Child[]>([]);

  const [
    activeChildId,
    setActiveChildId,
  ] = useState("");

  const [
    switchingReader,
    setSwitchingReader,
  ] = useState(false);

  const [
    completedCount,
    setCompletedCount,
  ] = useState(0);

  const [coins, setCoins] =
    useState(0);

  const [streak, setStreak] =
    useState(0);

  const [
    continueBook,
    setContinueBook,
  ] =
    useState<SavedBook | null>(
      null
    );

  const [favorites, setFavorites] =
    useState<SavedBook[]>([]);

  const [
    savedBooks,
    setSavedBooks,
  ] = useState<SavedBook[]>([]);

useEffect(() => {
  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup");
      return;
    }

    /* =====================================================
       LOAD ALL CHILDREN
    ===================================================== */

    const {
      data: childRows,
      error: childrenError,
    } = await supabase
      .from("children")
      .select(
        "id, name, avatar, avatar_config"
      )
      .eq(
        "user_id",
        user.id
      )
      .order("created_at", {
        ascending: true,
      });

    if (childrenError) {
      console.error(
        "Children error:",
        childrenError
      );
    }

    const readerChildren =
      (childRows || []) as Child[];

    setChildren(readerChildren);

    /* =====================================================
       FIND ACTIVE CHILD
    ===================================================== */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("active_child_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Profile error:",
        profileError
      );
    }

    let selectedChildId =
      profile?.active_child_id || "";

    if (
      !selectedChildId &&
      readerChildren.length > 0
    ) {
      selectedChildId =
        readerChildren[0].id;

      await supabase
        .from("profiles")
        .update({
          active_child_id:
            selectedChildId,
        })
        .eq(
          "id",
          user.id
        );
    }

    setActiveChildId(
      selectedChildId
    );

    /* =====================================================
       ACTIVE CHILD DETAILS
    ===================================================== */

    const activeChild =
      readerChildren.find(
        (child) =>
          child.id ===
          selectedChildId
      );

    if (activeChild) {
      setReaderName(
        activeChild.name ||
          "Reader"
      );

      setAvatar(
        activeChild.avatar ||
          "🔥"
      );

      setAvatarConfig(
        activeChild.avatar_config ||
          DEFAULT_AVATAR
      );
    }

    /* =====================================================
       ACTIVE CHILD READING STATS
    ===================================================== */

    if (selectedChildId) {
      const {
        data: history,
        error: historyError,
      } = await supabase
        .from("reading_history")
        .select(
          "completed_at, coins_earned"
        )
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "child_id",
          selectedChildId
        );

      if (historyError) {
        console.error(
          "Reading history error:",
          historyError
        );
      }

      if (history) {
        setCompletedCount(
          history.length
        );

        setCoins(
          history.reduce(
            (sum, item) =>
              sum +
              (item.coins_earned || 0),
            0
          )
        );

        const dates =
          Array.from(
            new Set(
              history
                .filter(
                  (item) =>
                    item.completed_at
                )
                .map((item) =>
                  new Date(
                    item.completed_at
                  )
                    .toISOString()
                    .slice(0, 10)
                )
            )
          ).sort(
            (a, b) =>
              b.localeCompare(a)
          );

        let currentStreak = 0;

        const today =
          new Date();

        for (
          let i = 0;
          i < dates.length;
          i++
        ) {
          const checkDate =
            new Date(today);

          checkDate.setDate(
            today.getDate() - i
          );

          const expected =
            checkDate
              .toISOString()
              .slice(0, 10);

          if (
            dates.includes(
              expected
            )
          ) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(
          currentStreak
        );
      }
    } else {
      setCompletedCount(0);
      setCoins(0);
      setStreak(0);
    }

    /* =====================================================
       BOOKMARKS
    ===================================================== */

    const {
      data: bookmarks,
    } = await supabase
      .from("book_bookmarks")
      .select(
        "id, page_number, books(title, slug, cover_url)"
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "updated_at",
        {
          ascending: false,
        }
      )
      .limit(4);

    if (bookmarks) {
      setContinueBook(
        bookmarks[0] || null
      );

      setSavedBooks(
        bookmarks as SavedBook[]
      );
    }

    /* =====================================================
       FAVORITES
    ===================================================== */

    const {
      data: likes,
    } = await supabase
      .from("book_likes")
      .select(
        "id, books(title, slug, cover_url)"
      )
      .eq(
        "user_id",
        user.id
      )
      .limit(4);

    if (likes) {
      setFavorites(
        likes as SavedBook[]
      );
    }
  }

  loadDashboard();
}, [router]);

  /* =========================================================
     SWITCH ACTIVE READER
  ========================================================= */

  async function switchReader(
    childId: string
  ) {
    if (
      !childId ||
      childId === activeChildId
    ) {
      return;
    }

    setSwitchingReader(true);

    try {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push(
          "/signup"
        );
        return;
      }

      /*
       * Verify this child belongs
       * to the logged-in guardian.
       */
      const child =
        children.find(
          (item) =>
            item.id === childId
        );

      if (!child) {
        throw new Error(
          "Reader could not be found."
        );
      }

      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          active_child_id:
            childId,
        })
        .eq(
          "id",
          user.id
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setActiveChildId(
        childId
      );

      /*
       * Reload so every dashboard
       * stat immediately reflects
       * the newly selected reader.
       */
      window.location.reload();
    } catch (error) {
      console.error(
        "Switch reader error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not switch readers."
      );

      setSwitchingReader(
        false
      );
    }
  }

  const continueBookInfo =
    Array.isArray(
      continueBook?.books
    )
      ? continueBook.books[0]
      : continueBook?.books;

  return (
    <>
      <Header />

      <main className="dashboardPage">
        <section className="dashboardHero">
          <img
            src="/images/home-hero.png"
            alt=""
            className="dashboardBg"
          />

          <div className="dashboardText">
            <h1>
              YOUR READING
              <br />
              ADVENTURE.
            </h1>

            <p>
              Keep reading stories,
              collect coins,
              <br />
              build your streak, and
              unlock rewards.
            </p>
          </div>

       <div className="dashboardWelcome">
  <div className="dashboardReaderSide">
    <div>
      <h2>
        WELCOME BACK,{" "}
        {readerName.toUpperCase()}!
      </h2>

      <div className="dashboardReaderSelector">
        <span>
          CURRENT READER
        </span>

        <div className="dashboardReaderSelectRow">
          <select
            value={activeChildId}
            onChange={(event) =>
              switchReader(
                event.target.value
              )
            }
            disabled={switchingReader}
          >
            {children.map(
              (child) => (
                <option
                  key={child.id}
                  value={child.id}
                >
                  {child.avatar || "📚"}{" "}
                  {child.name}
                </option>
              )
            )}
          </select>

          <Link
            href="/reader-setup"
            className="dashboardAddReader"
          >
            + ADD READER
          </Link>
        </div>
      </div>
    </div>
  </div>

  <div className="dashboardStatsArea">
   <div className="dashboardAvatarArea">
  <div
    className="dashboardCustomAvatar"
    data-skin={avatarConfig.skin}
    data-hair={avatarConfig.hair}
    data-hair-color={
      avatarConfig.hairColor
    }
    data-shirt={avatarConfig.shirt}
  >
    <div className="dashboardAvatarHair" />

    <div className="dashboardAvatarHead">
      <div className="dashboardAvatarEyes">
        <span />
        <span />
      </div>

      <div className="dashboardAvatarSmile" />
    </div>

    <div className="dashboardAvatarBody">
      <div className="dashboardAvatarShirt" />
    </div>
  </div>

  <Link
    href="/avatar-builder"
    className="dashboardBuildAvatarButton"
  >
    BUILD MY AVATAR
  </Link>
</div>

    <div className="dashboardStats">
      <div className="dashboardStat">
        <strong>
          🪙 {coins}
        </strong>

        <span>
          coins
        </span>
      </div>

      <div className="dashboardStat">
        <strong>
          {completedCount}
        </strong>

        <span>
          completed
        </span>
      </div>

      <div className="dashboardStat">
        <strong>
          🔥 {streak}
        </strong>

        <span>
          day streak
        </span>
      </div>
    </div>
  </div>
</div>

          <section className="dashboardPanel">
            <div className="dashboardCard">
              <div className="dashboardCardIcon">
                📖
              </div>

              <div>
                <h3>
                  Continue Reading
                </h3>

                {continueBookInfo ? (
                  <p>
                    {
                      continueBookInfo.title
                    }
                    <br />
                    Page{" "}
                    {continueBook?.page_number ||
                      1}
                  </p>
                ) : (
                  <p>
                    Jump into your
                    next magical story.
                  </p>
                )}

                {continueBookInfo ? (
                  <Link
                    href={`/books/${continueBookInfo.slug}/read?page=${
                      continueBook?.page_number ||
                      1
                    }`}
                  >
                    Continue
                  </Link>
                ) : (
                  <Link href="/library">
                    Go to Library
                  </Link>
                )}
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">
                ❤️
              </div>

              <div>
                <h3>
                  Favorites
                </h3>

                <p>
                  {favorites.length >
                  0
                    ? `${favorites.length} favorite stories saved.`
                    : "Tap the heart on stories you love."}
                </p>

                <Link href="/library">
                  View Library
                </Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">
                🔖
              </div>

              <div>
                <h3>
                  Saved Stories
                </h3>

                <p>
                  {savedBooks.length >
                  0
                    ? `${savedBooks.length} stories saved for later.`
                    : "Use the bookmark to save a story."}
                </p>

                <Link href="/library">
                  Browse Books
                </Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">
                🏆
              </div>

              <div>
                <h3>
                  Rewards
                </h3>

                <p>
                  {avatar} Build your
                  avatar with stickers
                  and coins.
                </p>

               <Link href="/avatar-builder">
  Build Avatar
</Link>
              </div>
            </div>

            <div className="dashboardCard">
              <div className="dashboardCardIcon">
                ⭐
              </div>

              <div>
                <h3>
                  Stickers
                </h3>

                <p>
                  Collect fun stickers
                  as you read and learn.
                </p>

                <Link href="/rewards">
                  View Stickers
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
