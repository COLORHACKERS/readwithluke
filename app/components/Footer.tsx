"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./footer.css";

function getTimeLeft() {
  const launchDate = new Date("2026-09-16T00:00:00");
  const now = new Date();

  const diff = Math.max(launchDate.getTime() - now.getTime(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export default function Footer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="rwlFooter">
      <div className="footerTop">
        <div className="footerLukeBox">
          <img src="/images/luke-thumbs-up.png" alt="Luke" />
        </div>

        <div className="footerBrandBox">
          <img
            src="/images/read-with-luke-wordmark.png"
            alt="Read With Luke"
          />
        </div>

        <nav className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/library">Library</Link>
          <Link href="/learn">Learn with Luke</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>

        <div className="footerNewsletter">
          <form className="footerEmailBar">
            <input placeholder="email for newsletter" />
            <button type="submit">
              <img src="/images/icon-send.png" alt="" />
            </button>
          </form>

          <p>
            Sign up for our newsletter for new books, announcements, games and
            more!
          </p>
        </div>
      </div>

      <div className="footerBottom">
        <div className="footerPrivacy">
          Privacy • Terms
        </div>

          <div>
            Read With Luke © 2026
            <br />
            All rights reserved.
          </div>
        </div>

        <div className="footerSocials">
          <button>
            <img src="/images/icon-facebook.png" alt="" />
          </button>

          <button>
            <img src="/images/icon-instagram.png" alt="" />
          </button>

          <button>
            <img src="/images/icon-youtube.png" alt="" />
          </button>
        </div>
    </footer>
  );
}
