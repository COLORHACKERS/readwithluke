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
          <img src="/images/home-hero.png" alt="Read With Luke" />

          <div className="heroCopyBlock">
            <p>READ WITH LUKE SOFT LAUNCH</p>
            <h1>
              Stories Today.
              <br />
              <span>Curiosity Forever.</span>
            </h1>
            <h2>
              Magical stories, fascinating facts, and fun adventures that inspire
              curious kids.
            </h2>

            <div className="heroTimer">
              <p>FREE ACCESS TRIAL ENDS IN</p>
              <div className="timerGrid">
                <TimeUnit label="Days" value={timeLeft.days} />
                <TimeUnit label="Hours" value={timeLeft.hours} />
                <TimeUnit label="Minutes" value={timeLeft.minutes} />
                <TimeUnit label="Seconds" value={timeLeft.seconds} />
              </div>
              <h3>START YOUR FREE TRIAL</h3>
              <small>
                We’re in early phase! Enjoy our books and learnings as we work
                towards our launch!
              </small>
            </div>
          </div>
        </section>

        <section className="homeCards">
          <Link href="/library" className="homeCard">
            <img src="/images/home-read-card.png" alt="Read With Luke" />
            <div>
              <h2>READ WITH LUKE</h2>
              <p>
                Cinematic style books with fun stories written by me, Luke and my
                dad. Enjoy!
              </p>
              <span>START READING</span>
            </div>
          </Link>

          <Link href="/learn" className="homeCard">
            <img src="/images/home-learn-card.png" alt="Learn With Luke" />
            <div>
              <h2>LEARN WITH LUKE</h2>
              <p>
                Learn about cool things, people, animals and interesting “whys”
                in a fun way!
              </p>
              <span>START LEARNING</span>
            </div>
          </Link>
        </section>
<section className="bottomStoryWorld">
        <section className="lukeIntro">
          <div>
            <h2>Hey there! I’m Luke.</h2>
            <p>
              Since I was 4 years old I’ve been creating fun stories before
              bedtime. I wrote down the stories with my parents and now we are
              ready to share! I created <strong>Read with Luke</strong> to make
              reading and learning fun and exciting like movies and fun comics.
              Growing up should be full of imagination and wonder! I teamed up
              with my dad to bring our stories to life.
            </p>
            <p>
              Thanks for being here! You’re helping to make my dream come true!
            </p>
          </div>

          <img src="/images/luke-intro.png" alt="Luke" />
        </section>

        <section className="finalTrial">
          <h2>START YOUR FREE TRIAL</h2>
          <p>
            We’re in <strong>early phase!</strong> Enjoy our books and learnings
            as we work towards our <strong>LAUNCH!</strong>
          </p>

          <Link href="/library">START TRIAL</Link>

          <small>$12.99 a month after trial. Cancel anytime.</small>
        </section>
        </section>
      </main>
    </>
  );
}


function TimeUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="timeUnit">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}