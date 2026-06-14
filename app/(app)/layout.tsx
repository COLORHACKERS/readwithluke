import Link from "next/link";
import { Home, BookOpen, Mic, Flag, Gift } from "lucide-react";
import "../home.css";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rwlShell">
      <header className="topHeader">
        <Link href="/" className="topLogo">
          <img src="/logo-read-with-luke.png" alt="Read With Luke" />
        </Link>

        <nav className="topNav">
          <Link href="/" className="activeNav">
            <Home />
            Home
          </Link>

          <Link href="/library">
            <BookOpen />
            Library
          </Link>

          <Link href="/learn">
            <BookOpen />
            Learn
          </Link>

        </nav>

        <div className="topRight">
          <div className="streakPill">🔥 12</div>
          <img src="/images/luke-avatar.png" alt="Luke" className="avatar" />
        </div>
      </header>

      <main className="rwlMain">{children}</main>
    </div>
  );
}