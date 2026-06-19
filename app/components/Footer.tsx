import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="rwlFooter">
      <div className="footerLogoBlock">
        <img
          src="/images/read-with-luke-wordmark.png"
          alt="Read With Luke"
          className="footerWordmark"
        />

        <div className="footerLegal">
          <p>Privacy * Terms</p>
          <p>ReadwithLuke © 2026</p>
          <p>Luke's World, LLC. All rights reserved.</p>
        </div>
      </div>

      <div className="footerLinks">
        <Link href="/">Home</Link>
        <Link href="/library">Library</Link>
        <Link href="/learn">Learn with Luke</Link>
        <Link href="/leaderboard">Leaderboard</Link>
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

      <div className="footerNewsletter">
        <div className="footerEmailBar">
          <input
            placeholder="email for newsletter"
          />

          <button>
            <img src="/images/icon-send.png" alt="" />
          </button>
        </div>

        <p>
          Sign up for our newsletter for new books,
          announcements, games and more!
        </p>

        <img
          src="/images/luke-thumbs-up.png"
          alt="Luke"
          className="footerLuke"
        />
      </div>
    </footer>
  );
}