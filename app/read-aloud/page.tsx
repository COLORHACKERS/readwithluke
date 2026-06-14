import Link from "next/link";

const stories = [
  { title: "The Mystery Key", img: "/stories/mystery-key.jpg" },
  { title: "Lost in the Rain", img: "/stories/lost-rain.jpg" },
];

export default function HomePage() {
  return (
    <main className="rwl-shell">
      <aside className="sidebar">
        <div className="logo">
          📖 <span>READ<br />LUKE</span>
        </div>

        <nav>
          <Link className="active" href="/">🏠 Home</Link>
          <Link href="/library">📚 Library</Link>
          <Link href="/progress">🎤 My Progress</Link>
          <Link href="/quests">🚩 Quests</Link>
          <Link href="/rewards">🎁 Rewards</Link>
        </nav>

        <div className="frog-card">
          <img src="/frog-host.png" />
          <div>
            <p>Welcome back!</p>
            <strong>🔥 12</strong>
            <span>day streak</span>
          </div>
        </div>
      </aside>

      <section className="main-stage">
        <header className="topbar">
          <div className="mobile-logo">📖 READ LUKE</div>

          <nav className="desktop-nav">
            <Link className="active" href="/">Home</Link>
            <Link href="/library">Library</Link>
            <Link href="/progress">My Progress</Link>
            <Link href="/quests">Quests</Link>
            <Link href="/rewards">Rewards</Link>
          </nav>

          <div className="stats">
            <span>🔥 12</span>
            <img src="/avatar.png" />
          </div>
        </header>

        <div className="hero">
          <div className="hero-content">
            <h1>Your Journey</h1>
            <p>Keep learning. Keep exploring.</p>

            <div className="path">
              <div className="kid">
                <img src="/luke-character.png" />
                <span>1</span>
                <div>⭐ ⭐ ⭐</div>
              </div>

              <button className="step s2">2</button>
              <button className="step s3">3</button>
              <button className="step s4">4</button>
              <button className="step locked s5">5</button>
              <button className="step locked s6">6</button>
            </div>
          </div>

          <aside className="goal-card">
            <h3>Today’s Goal</h3>

            <div className="progress-ring">
              <span>📖</span>
            </div>

            <strong>2 / 3</strong>
            <p>Lessons Completed</p>

            <Link href="/library" className="continue-btn">
              Continue Lesson →
            </Link>

            <div className="story-picks">
              <h4>Pick Up a Story</h4>

              <div className="story-grid">
                {stories.map((story) => (
                  <Link href="/library" className="story-card" key={story.title}>
                    <img src={story.img} />
                    <span>{story.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}