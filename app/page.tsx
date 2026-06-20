"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "@/app/components/Footer";
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
            <span className="launchDate">
  Launching September 16, 2026
</span>
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
  <Link href="/library/little-treehouse-mysteries" className="homeStoryCard">
    <img src="/images/home-card-1.png" alt="Tree House Mysteries" />
    <h3>TREEHOUSE<br />MYSTERIES</h3>
  </Link>

  <Link href="/library/the-toy-maker" className="homeStoryCard">
    <img src="/images/home-card-3.png" alt="The Toy Maker" />
    <h3>THE TOYMAKER</h3>
  </Link>

  <Link href="/library/the-great-crockoff" className="homeStoryCard">
    <img src="/images/home-card-4.png" alt="The Great Crockoff" />
    <h3>THE GREAT<br />CROCK-OFF!</h3>
  </Link>

  <Link href="/library/sammy-finds-her-way-home" className="homeStoryCard">
    <img src="/images/home-card-2.png" alt="Sammy Finds Her Way Home" />
    <h3>SAMMY FINDS<br />HER WAY</h3>
  </Link>
</div>

            <button className="carouselBtn right">
              <img src="/images/icon-arrow-right.png" alt="" />
            </button>
          </section>
        </section>

           </main>

      <Footer />
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