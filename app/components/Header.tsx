"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./header.css";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

  const [initials, setInitials] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  function active(path: string) {
    if (path === "/library") {
      return pathname === "/library" || pathname.startsWith("/books/");
    }

    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  }

  useEffect(() => {
    async function loadUserStats() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setInitials(null);
        setCoins(0);
        setStreak(0);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name,email")
        .eq("id", user.id)
        .single();

      const first =
        profile?.first_name?.trim()?.[0] || user.email?.trim()?.[0] || "";

      const last = profile?.last_name?.trim()?.[0] || "";

      setInitials(`${first}${last}`.toUpperCase() || "A");

      const { data: history } = await supabase
        .from("reading_history")
        .select("completed_at, coins_earned")
        .eq("user_id", user.id);

      if (!history) return;

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

        if (dates.includes(expected)) currentStreak++;
        else break;
      }

      setStreak(currentStreak);
    }

    loadUserStats();
  }, [pathname]);

  return (
    <>
      <header className="mainHeader">
        <Link href="/" className="headerLogo">
          <img src="/images/luke-intro.png" alt="Read With Luke" />
        </Link>

    <nav className="mainNav">
  <Link
    href="/library"
    className={active("/library") ? "active" : ""}
  >
    Read With Luke
  </Link>

  <Link
    href="/learn"
    className={isActive("/learn") ? "active" : ""}
  >
    Learn With Luke
  </Link>

  <Link
    href="/learn-to-read"
    className={active("/learn-to-read") ? "active" : ""}
  >
    Learn To Read
  </Link>
</nav>
        <div className="headerRight">
          {initials ? (
            <div className="headerStatus">
              <Link href="/dashboard" className="statusItem">
                🔥 {streak}
              </Link>

              <Link href="/dashboard" className="statusItem">
                🪙 {coins}
              </Link>

              <Link href="/profile" className="statusAvatar">
                {initials}
              </Link>
            </div>
          ) : (
           <div className="headerAuth">
  <Link href="/login" className="headerLogin">
    LOGIN
  </Link>

  <Link href="/membership" className="headerSignup">
    JOIN
  </Link>

  <Link href="/gift" className="headerGift">
    GIFT
  </Link>
</div>
          )}

          <button
            className="mobileMenuButton"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobileMenuOverlay" onClick={() => setMenuOpen(false)}>
          <nav
            className="mobileMenu"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="mobileMenuClose"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ×
            </button>

            <Link href="/library" onClick={() => setMenuOpen(false)}>
              Read With Luke
            </Link>

            <Link href="/learn" onClick={() => setMenuOpen(false)}>
              Learn With Luke
            </Link>

            <Link href="/learn-to-read" onClick={() => setMenuOpen(false)}>
              Learn to Read
            </Link>

           <Link href="/gift" onClick={() => setMenuOpen(false)}>
  Gift
</Link>

            {initials ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </Link>

                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
