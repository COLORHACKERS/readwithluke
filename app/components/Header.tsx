"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./header.css";

export default function Header() {
  const pathname = usePathname();
  const [initials, setInitials] = useState<string | null>(null);

  function active(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setInitials(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name")
        .eq("id", user.id)
        .single();

      const first = profile?.first_name?.[0] || "";
      const last = profile?.last_name?.[0] || "";

      setInitials(`${first}${last}` || "•");
    }

    loadUser();
  }, []);

  return (
    <header className="mainHeader">
      <Link href="/" className="headerLogo">
        <img src="/images/luke-intro.png" alt="Read With Luke" />
      </Link>

      <nav className="mainNav">
        <Link className={active("/") ? "active" : ""} href="/">
          Home
        </Link>

        <Link className={active("/library") ? "active" : ""} href="/library">
          Library
        </Link>

        <Link className={active("/learn") ? "active" : ""} href="/learn">
          Learn with Luke
        </Link>

        <Link
          className={active("/leaderboard") ? "active" : ""}
          href="/leaderboard"
        >
          Leaderboard
        </Link>
      </nav>

      <div className="headerRight">
       {initials ? (
  <>
    <Link
      href="/dashboard"
      className={`headerStreak ${active("/dashboard") ? "active" : ""}`}
    >
      <span className="headerFlame">🔥</span>
    </Link>

    <Link
      href="/profile"
      className={`headerAvatar ${active("/profile") ? "active" : ""}`}
    >
      {initials}
    </Link>
  </>
) : (
  <div className="headerAuth">
    <Link href="/login" className="headerLogin">
      LOGIN
    </Link>

    <Link href="/signup" className="headerSignup">
      JOIN
    </Link>
  </div>
)}
      </div>
    </header>
  );
}