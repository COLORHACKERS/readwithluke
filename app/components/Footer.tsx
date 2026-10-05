"use client";

import { useState } from "react";
import Link from "next/link";
import "./footer.css";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
const [newsletterStatus, setNewsletterStatus] = useState<
  "idle" | "loading" | "success" | "error"
>("idle");

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
          <Link href="/free-reads">Read Free</Link>
          <Link href="/about">About</Link>
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

  <p role="status" aria-live="polite">
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

       <div className="footerCopyright">
  Read With Luke © 2026
  <br />
  All rights reserved.
</div>
        </div>

    </footer>
  );
}
