"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./home.css";

function getTimeLeft() {
  const trialStart = new Date("2026-06-18T00:00:00");
  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + 90);

  const now = new Date();
  const diff = Math.max(trialEnd.getTime() - now.getTime(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="homeWrap">
      <section className="homeCanvas">
        <img src="/images/home-hero.png" className="homeBg" alt="" />

        <header className="homeHeader">
          <Link href="/" className="homeLogo">
            <img src="/images/luke-logo-badge.png" alt="Read With Luke" />
          </Link>

          <nav>
            <Link className="active" href="/">Home</Link>
            <Link href="/library">Library</Link>
            <Link href="/learn">Learn with Luke</Link>
            <Link href="/leaderboard">Leaderboard</Link>
          </nav>

          <div className="headerActions">
            <div className="streak">🔥 12</div>
            <div className="avatar">LL</div>
          </div>
        </header>

        <section className="heroText">
          <h1>
            STORIES.
            <br />
            ADVENTURE.
            <br />
            KNOWLEDGE.
          </h1>

          <p>
            Stories for kids that are magical, exciting, and cinematic like
            movies. Fascinating facts and fun learning that inspire and grow
            imagination!
          </p>
        </section>

        <section className="countdownBox">
          <h2>
            READ FOR FREE UNTIL
            <br />
            OUR OFFICIAL LAUNCH IN...
          </h2>

          <div className="countdownGrid">
            <TimeUnit value={timeLeft.days} label="days" />
            <TimeUnit value={timeLeft.hours} label="hours" />
            <TimeUnit value={timeLeft.minutes} label="minutes" />
            <TimeUnit value={timeLeft.seconds} label="seconds" />
          </div>
        </section>

        <section className="storyCarousel">
          <button className="carouselArrow left">←</button>

          <div className="storyCards">
            <img src="/images/home-card-1.png" alt="" />
            <img src="/images/home-card-2.png" alt="" />
            <img src="/images/home-card-3.png" alt="" />
            <img src="/images/home-card-4.png" alt="" />
          </div>

          <button className="carouselArrow right">→</button>
        </section>

        <footer className="homeFooter">
          <div>
            <img src="/images/read-with-luke-wordmark.png" alt="" className="footerLogo" />

            <p className="legal">
              Privacy * Terms
              <br />
              ReadwithLuke © 2026
              <br />
              Luke’s World, LLC. All rights reserved.
            </p>
          </div>

          <div className="footerLinks">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/help">Help</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="socials">
            <span>f</span>
            <span>◎</span>
            <span>▶</span>
          </div>

          <div className="newsletter">
            <div className="emailBar">
              <span>email for newsletter</span>
              <button>➤</button>
            </div>

            <p>
              Sign up for our newsletter for new books, announcements, games
              and more!
            </p>

            <img src="/images/luke-thumbsup.png" alt="" className="lukeOverlay" />
          </div>
        </footer>
      </section>
    </main>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}