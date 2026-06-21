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
  Launching 09/16/2026
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

          <section className="homeMarquee">
  <div className="marqueeTrack">
    <BookMarqueeCard
      large
      href="/books/little-treehouse-mysteries"
      image="/images/home-card-1.png"
      title="DETECT."
      description="A mystery adventure inside a strange treehouse."
    />

    <BookMarqueeCard
      href="/books/sammy-finds-her-way-home"
      image="/images/home-card-4.png"
      title="SAMMY FINDS HER WAY HOME"
      description="A brave journey through a wild sunset storm."
    />

    <BookMarqueeCard
      href="/books/the-toy-maker"
      image="/images/home-card-2.png"
      title="THE TOY MAKER"
      description="A magical world of inventions and wonder."
    />

    <BookMarqueeCard
      href="/books/the-great-crockoff"
      image="/images/home-card-3.png"
      title="THE GREAT CROCKOFF!"
      description="A hilarious creature adventure."
    />

    <BookMarqueeCard
      href="/books/little-treehouse-mysteries"
      image="/images/home-card-1.png"
      title="TREE HOUSE MYSTERIES"
      description="Friends, clues, and spooky surprises."
    />

    <BookMarqueeCard
      href="/books/sammy-finds-her-way-home"
      image="/images/home-card-4.png"
      title="SAMMY FINDS HER WAY HOME"
      description="A warm story about courage and home."
    />

    <BookMarqueeCard
      href="/books/the-toy-maker"
      image="/images/home-card-2.png"
      title="THE TOY MAKER"
      description="A cinematic adventure full of magic."
    />

    <BookMarqueeCard
      href="/books/the-great-crockoff"
      image="/images/home-card-3.png"
      title="THE GREAT CROCKOFF!"
      description="A funny, wild story kids will love."
    />
  </div>
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
function BookMarqueeCard({
  href,
  image,
  title,
  description,
  large = false,
}: {
  href: string;
  image: string;
  title: string;
  description: string;
  large?: boolean;
}) {
  return (
    <Link href={href} className={`marqueeCard ${large ? "large" : ""}`}>
      <img src={image} alt={title} />

      <div className="marqueeOverlay">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
}