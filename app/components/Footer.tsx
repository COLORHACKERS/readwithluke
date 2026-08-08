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
  const [newsletterEmail, setNewsletterEmail] = useState("");
const [newsletterStatus, setNewsletterStatus] = useState<
  "idle" | "loading" | "success" | "error"
>("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  async function handleNewsletterSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  const email = newsletterEmail.trim().toLowerCase();

  if (!email) return;

  setNewsletterStatus("loading");

  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to subscribe.");
    }

    setNewsletterEmail("");
    setNewsletterStatus("success");
  } catch (error) {
    console.error("Newsletter signup error:", error);
    setNewsletterStatus("error");
  }
}

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
  <form
    className="footerEmailBar"
    onSubmit={handleNewsletterSubmit}
  >
    <input
      type="email"
      placeholder="email for newsletter"
      value={newsletterEmail}
      onChange={(e) => {
        setNewsletterEmail(e.target.value);

        if (
          newsletterStatus === "success" ||
          newsletterStatus === "error"
        ) {
          setNewsletterStatus("idle");
        }
      }}
      required
      disabled={newsletterStatus === "loading"}
      aria-label="Email for newsletter"
    />

    <button
      type="submit"
      disabled={newsletterStatus === "loading"}
      aria-label="Sign up for newsletter"
    >
      <img src="/images/icon-send.png" alt="" />
    </button>
  </form>

  <p>
    {newsletterStatus === "success"
      ? "You're in! Watch your inbox for new stories."
      : newsletterStatus === "error"
      ? "Oops! We couldn't sign you up. Please try again."
      : newsletterStatus === "loading"
      ? "Signing you up..."
      : "Sign up for our newsletter for new books, announcements, games and more!"}
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
