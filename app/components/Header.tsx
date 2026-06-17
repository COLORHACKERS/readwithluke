import Link from "next/link";
import {
  Home,
  BookOpen,
  Mic,
  Flag,
  Gift,
  Flame,
} from "lucide-react";

import "./header.css";

export default function Header() {
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
        <Link href="/" className="active">
          <Home size={18} />
          Home
        </Link>

        <Link href="/library">Library</Link>
        <Link href="/learn">Learn with Luke</Link>
        <Link href="/quests">Stickers</Link>
        <Link href="/rewards">Progress</Link>
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