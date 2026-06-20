import Link from "next/link";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
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
          <div className="dashboardText">
            <h1>
              YOUR READING
              <br />
              ADVENTURE.
            </h1>

            <p>
              Keep reading stories, finish learnings, collect rewards,
              and build your streak every day.
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
        </section>

        <section className="dashboardPanel">
          <div className="dashboardCard">
            <h3>Continue Reading</h3>
            <p>Jump back into your latest story.</p>
            <Link href="/library">Go to Library</Link>
          </div>

          <div className="dashboardCard">
            <h3>Learn with Luke</h3>
            <p>Finish fun facts and learning adventures.</p>
            <Link href="/learn">Start Learning</Link>
          </div>

          <div className="dashboardCard">
            <h3>Rewards</h3>
            <p>Stickers, badges, and prizes you unlock.</p>
            <Link href="/rewards">View Rewards</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}