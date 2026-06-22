"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "@/app/components/Footer";
import "./home.css";

function getTimeLeft() {
  const launchDate = new Date("2026-09-16T00:00:00");
  const now = new Date();
  const diff = Math.max(launchDate.getTime() - now.getTime(), 0);

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
        <img src="/images/home-hero.png" alt="" className="homeBg" />

        <section className="homeHero">
          <div className="homeHeroText">
            <h1>
              STORIES.
              <br />
              ADVENTURE.
              <br />
              KNOWLEDGE.
            </h1>

            <p>
              Fun facts, science, animals, space, history,
              <br />
              and amazing things explained like a comic.
            </p>
          </div>

          <Link href="/membership" className="homeTimer">
            <span className="launchDate">Launching 09/16/2026</span>

            <h2>
              SIGN UP AND READ FOR FREE
              <br />
              UNTIL OUR OFFICIAL LAUNCH IN...
            </h2>

            <div className="timerGrid">
              <TimeUnit value={timeLeft.days} label="days" />
              <TimeUnit value={timeLeft.hours} label="hours" />
              <TimeUnit value={timeLeft.minutes} label="minutes" />
              <TimeUnit value={timeLeft.seconds} label="seconds" />
            </div>

            <strong>CREATE AN ACCOUNT AND START READING!</strong>
          </Link>
        </section>

        <section className="homeMarquee">
          <h2>New Learning Adventures</h2>

          <div className="marqueeWindow">
            <div className="marqueeTrack">
              <HomeCard href="/books/little-treehouse-mysteries" image="/images/home-card-1.png" title="DETECT." />
              <HomeCard href="/books/sammy-finds-her-way-home" image="/images/home-card-4.png" title="LAUGH." />
              <HomeCard href="/books/the-toy-maker" image="/images/home-card-2.png" title="FEEL." />
              <HomeCard href="/books/the-great-crockoff" image="/images/home-card-3.png" title="IMAGINE." />

              <HomeCard href="/books/little-treehouse-mysteries" image="/images/home-card-1.png" title="DETECT." />
              <HomeCard href="/books/sammy-finds-her-way-home" image="/images/home-card-4.png" title="LAUGH." />
              <HomeCard href="/books/the-toy-maker" image="/images/home-card-2.png" title="FEEL." />
              <HomeCard href="/books/the-great-crockoff" image="/images/home-card-3.png" title="IMAGINE." />
            </div>
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

function HomeCard({
  href,
  image,
  title,
}: {
  href: string;
  image: string;
  title: string;
}) {
  return (
    <Link href={href} className="marqueeCard">
      <img src={image} alt={title} />

      <div className="marqueeOverlay">
        <h3>{title}</h3>
      </div>
    </Link>
  );
}