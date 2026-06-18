"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Flame,
} from "lucide-react";

import "./header.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="rwlHeader">
      <Link href="/" className="rwlLogo">
        <span className="bookIcon">📖</span>
        <span className="logoText">
          READ<span>WITH</span>
          <br />
          LUKE
        </span>
      </Link>

      <nav className="rwlNav">
        <Link
          href="/"
          className={pathname === "/" ? "active" : ""}
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          href="/library"
          className={pathname.startsWith("/library") || pathname.startsWith("/books") ? "active" : ""}
        >
          Library
        </Link>

        <Link
          href="/learn"
          className={pathname.startsWith("/learn") ? "active" : ""}
        >
          Learn with Luke
        </Link>

        <Link
          href="/quests"
          className={pathname.startsWith("/quests") ? "active" : ""}
        >
          Stickers
        </Link>

        <Link
          href="/rewards"
          className={pathname.startsWith("/rewards") ? "active" : ""}
        >
          Progress
        </Link>
      </nav>

      <div className="rwlActions">
        <div className="streak">
          <Flame size={20} fill="#ff6b00" />
          <span>12</span>
        </div>

        <div className="avatar">
          🧒
        </div>
      </div>
    </header>
  );
}