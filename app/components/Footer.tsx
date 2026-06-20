import Link from "next/link";
import "./footer.css";

export default function Footer() {
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
          <form className="footerEmailBar">
            <input placeholder="email for newsletter" />
            <button type="submit">
              <img src="/images/icon-send.png" alt="" />
            </button>
          </form>

          <p>
            Sign up for our newsletter for new books, announcements, games and
            more!
          </p>
        </div>
      </div>

      <div className="footerBottom">
        <div className="footerPrivacy">Privacy * Terms</div>

        <div className="footerCopyright">
          ReadwithLuke © 2026
          <br />
         All rights reserved.
        </div>

        <div className="footerSocials">
          <button><img src="/images/icon-facebook.png" alt="" /></button>
          <button><img src="/images/icon-instagram.png" alt="" /></button>
          <button><img src="/images/icon-youtube.png" alt="" /></button>
        </div>
      </div>
    </footer>
  );
}