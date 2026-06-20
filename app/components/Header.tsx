"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./header.css";

export default function Header() {
  const pathname = usePathname();

  function active(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }

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
        <Link
          href="/dashboard"
          className={`headerStreak ${active("/dashboard") ? "active" : ""}`}
          aria-label="Dashboard"
        >
          🔥 <span>12</span>
        </Link>

        <Link
          href="/profile"
          className={`headerAvatar ${active("/profile") ? "active" : ""}`}
          aria-label="Profile"
        >
          LL
        </Link>
      </div>
    </header>
  );
}