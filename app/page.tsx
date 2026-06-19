"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";
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
    <>
      <Header />

      <main className="homePage">
        <section className="homeHero">
          <img src="/images/home-hero.png" alt="" className="homeBg" />

          <div className="homeHeroText">
            <h1>
              STORIES.
              <br />
              ADVENTURE.
              <br />
              KNOWLEDGE.
            </h1>

            <p>
              Stories for kids that are magical,
              <br />
              exciting, and cinematic like movies.
              <br />
              Fascinating facts and fun learnings that
              <br />
              inspire and grow imagination!
            </p>
          </div>

          <div className="homeTimer">
            <h2>
              READ FOR FREE UNTIL
              <br />
              OUR OFFICIAL LAUNCH IN...
            </h2>

            <div className="timerGrid">
              <TimeUnit value={timeLeft.days} label="days" />
              <TimeUnit value={timeLeft.hours} label="hours" />
              <TimeUnit value={timeLeft.minutes} label="minutes" />
              <TimeUnit value={timeLeft.seconds} label="seconds" />
            </div>
          </div>

          <section className="homeCarousel">
            <button className="carouselBtn left">
              <img src="/images/icon-arrow-left.png" alt="" />
            </button>

            <div className="carouselImages">
              <img src="/images/home-card-1.png" alt="" />
              <img src="/images/home-card-2.png" alt="" />
              <img src="/images/home-card-3.png" alt="" />
              <img src="/images/home-card-4.png" alt="" />
            </div>

            <button className="carouselBtn right">
              <img src="/images/icon-arrow-right.png" alt="" />
            </button>
          </section>
        </section>

        <footer className="homeFooter">
          <div className="footerBrand">
            <img
              src="/images/read-with-luke-wordmark.png"
              alt="Read With Luke"
            />

            <p>
              Privacy * Terms
              <br />
              ReadwithLuke © 2026
              <br />
              Luke’s World, LLC. All rights reserved.
            </p>
          </div>

          <nav className="footerLinks">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/help">Help</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="footerSocials">
            <button><img src="/images/icon-facebook.png" alt="" /></button>
            <button><img src="/images/icon-instagram.png" alt="" /></button>
            <button><img src="/images/icon-youtube.png" alt="" /></button>
          </div>

          <div className="newsletter">
            <form className="emailBar">
              <input type="email" placeholder="email for newsletter" />
              <button>
                <img src="/images/icon-send.png" alt="" />
              </button>
            </form>

            <p>
              Sign up!
            </p>

            <img
              src="/images/luke-thumbs-up.png"
              alt="Luke"
              className="footerLuke"
            />
          </div>
        </footer>
      </main>
    </>
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