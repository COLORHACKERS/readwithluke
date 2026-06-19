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
        <section className="homeTopHero">
          <img
            src="/images/home-hero.png"
            alt="Read With Luke"
            className="homeHeroBg"
          />

          <div className="homeHeroOverlay">
            <p className="eyebrow">READ WITH LUKE SOFT LAUNCH</p>

            <h1>
              Stories Today.
              <br />
              <span>Curiosity Forever.</span>
            </h1>

            <p className="heroCopy">
              Magical stories, fascinating facts, and fun adventures that
              inspire curious kids.
            </p>

            <div className="heroButtons">
              <Link href="/library" className="primaryBtn">
                READ STORIES
              </Link>

              <Link href="/learn" className="secondaryBtn">
                LEARN WITH LUKE
              </Link>
            </div>
          </div>
        </section>

        <section className="trialCard">
          <div className="trialRocketPlaceholder">🚀</div>

          <div className="trialContent">
            <div className="softBadge">⭐ SOFT LAUNCH</div>

            <h2>START YOUR FREE TRIAL</h2>

            <p>
              We’re in <strong>soft launch!</strong> Support us as we work
              towards our <strong>grand launch.</strong>
            </p>

            <div className="timerBox">
              <p>Your free trial ends in</p>

              <div className="timerGrid">
                <TimeUnit label="Days" value={timeLeft.days} />
                <TimeUnit label="Hours" value={timeLeft.hours} />
                <TimeUnit label="Minutes" value={timeLeft.minutes} />
                <TimeUnit label="Seconds" value={timeLeft.seconds} />
              </div>
            </div>

            <Link href="/library" className="trialBtn">
              START YOUR FREE TRIAL →
            </Link>
          </div>

          <div className="trialStampPlaceholder">
            <span>Trial Started</span>
            <strong>June 18, 2026</strong>
            <small>90 Days Free</small>
          </div>
        </section>

        <section className="exploreSection">
          <h2>
            <span>⭐</span>
            Explore. Learn. Grow.
            <span>⭐</span>
          </h2>

          <div className="featureGrid">
            <Feature
              className="featureYellow"
              icon="📖"
              title="Read"
              text="Enjoy exciting stories that spark imagination."
            />
            <Feature
              className="featureBlue"
              icon="🪐"
              title="Learn"
              text="Discover cool things like why astronauts wear suits in space."
            />
            <Feature
              className="featurePurple"
              icon="⭐"
              title="Stickers"
              text="Collect rewards as you read and learn."
            />
            <Feature
              className="featureGreen"
              icon="📈"
              title="Progress"
              text="Track growth and celebrate wins."
            />
            <Feature
              className="featurePink"
              icon="🎁"
              title="Rewards"
              text="Unlock surprises for hard work."
            />
          </div>
        </section>

        <section className="missionGrid">
          <div className="missionCard lukeCard">
            <div className="lukeFace">🧒</div>

            <div>
              <h3>Hey there! I’m Luke.</h3>
              <p>
                I created Read With Luke to make reading exciting, learning fun,
                and growing up curious something every kid can enjoy.
              </p>
              <strong>— Luke</strong>
            </div>
          </div>

          <div className="missionCard supportCard">
            <div className="heartIcon">❤️</div>

            <div>
              <h3>Support Our Mission</h3>
              <p>
                We’re a small team with a big dream — to help every child build
                confidence, curiosity, and a love for learning.
              </p>
              <strong>
                Thank you for supporting us as we work towards our grand launch!
              </strong>
            </div>
          </div>
        </section>
        <section className="trustSection">
  <div className="trustGrid">
    <div className="trustItem">
      <span>🛡️</span>
      <div>
        <h4>Safe & Kid-Friendly</h4>
        <p>A safe space made just for kids.</p>
      </div>
    </div>

    <div className="trustItem">
      <span>🚫</span>
      <div>
        <h4>Ad Free</h4>
        <p>Enjoy reading and learning without distractions.</p>
      </div>
    </div>

    <div className="trustItem">
      <span>❤️</span>
      <div>
        <h4>Made with Love</h4>
        <p>Built with love for families like yours.</p>
      </div>
    </div>

    <div className="trustItem">
      <span>🚀</span>
      <div>
        <h4>Always Improving</h4>
        <p>New stories and lessons added every week.</p>
      </div>
    </div>
  </div>

  <div className="launchBanner">
    <div className="launchLeft">
      <h3>Be part of our soft launch!</h3>
      <p>
        Your feedback helps us build something amazing for kids.
      </p>
    </div>

    <Link href="/library" className="launchCTA">
      <strong>START YOUR FREE TRIAL</strong>
      <span>90-DAY FREE ACCESS</span>
    </Link>

    <div className="launchMoon">
      🌙
    </div>
  </div>
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

function Feature({
  icon,
  title,
  text,
  className,
}: {
  icon: string;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <div className={`featureCard ${className}`}>
      <div className="featureIcon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}