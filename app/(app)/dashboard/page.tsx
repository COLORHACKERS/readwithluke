import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "../../home.css";
import "./dashboard.css";

export default function DashboardPage() {
  const firstName = "Luke";
  const initials = "LL";
  const finishedCount = 12;

  return (
    <>
      <Header />

      <main className="dashboardPage">
        <section className="dashboardHero">
          <img src="/images/home-hero.png" alt="" className="dashboardBg" />

          <div className="dashboardText">
            <h1>
              YOUR READING
              <br />
              ADVENTURE.
            </h1>

            <p>
              Keep reading stories, finish learnings,
              <br />
              collect rewards, and build your streak
              <br />
              every day.
            </p>
          </div>

          <div className="dashboardWelcome">
            <h2>WELCOME BACK, {firstName.toUpperCase()}!</h2>

            <div className="dashboardStats">
              <div className="dashboardStat">
                <strong>{finishedCount}</strong>
                <span>finished</span>
              </div>

              <div className="dashboardStat">
                <strong>🔥</strong>
                <span>dashboard</span>
              </div>

              <div className="dashboardStat">
                <strong>{initials}</strong>
                <span>profile</span>
              </div>
            </div>
          </div>

          <section className="dashboardPanel">
            <div className="dashboardCard">
              <div>
                <h3>Continue Reading</h3>
                <p>Jump back into your latest magical story.</p>
              </div>
              <Link href="/library">Go to Library</Link>
            </div>

            <div className="dashboardCard">
              <div>
                <h3>Learn with Luke</h3>
                <p>Finish fun facts and learning adventures.</p>
              </div>
              <Link href="/learn">Start Learning</Link>
            </div>

            <div className="dashboardCard">
              <div>
                <h3>Rewards</h3>
                <p>Collect stickers, badges, and reading prizes.</p>
              </div>
              <Link href="/rewards">View Rewards</Link>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}