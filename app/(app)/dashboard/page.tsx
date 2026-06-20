import Link from "next/link";

export default function DashboardPage() {
  const firstName = "Luke";
  const finishedCount = 12;

  return (
    <main className="homePage dashboardHome">
      <section className="homeHero">
        <div className="homeHeroText">
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

        <div className="countdownBox dashboardBox">
          <h2>WELCOME BACK, {firstName.toUpperCase()}!</h2>

          <div className="countdownNumbers">
            <div>
              <strong>{finishedCount}</strong>
              <span>finished</span>
            </div>

            <div>
              <strong>🔥</strong>
              <span>dashboard</span>
            </div>

            <div>
              <strong>LL</strong>
              <span>profile</span>
            </div>
          </div>
        </div>
      </section>

      <section className="storyCarousel dashboardCards">
        <div className="dashboardMiniCard">
          <h3>Continue Reading</h3>
          <p>Jump back into your latest story.</p>
          <Link href="/library">Go to Library</Link>
        </div>

        <div className="dashboardMiniCard">
          <h3>Learn with Luke</h3>
          <p>Finish fun facts and learning adventures.</p>
          <Link href="/learn">Start Learning</Link>
        </div>

        <div className="dashboardMiniCard">
          <h3>Rewards</h3>
          <p>Stickers, badges, and prizes you unlock.</p>
          <Link href="/rewards">View Rewards</Link>
        </div>
      </section>
    </main>
  );
}