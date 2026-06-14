import Link from "next/link";

const books = [
  {
    title: "The Mystery Key",
    level: "Level 1",
    pages: "2 / 10 Pages",
     image: "/images/pricing-adventure-bg.png",
    slug: "the-mystery-key",
    badge: "New",
  },
  {
    title: "Lost in the Rain",
    level: "Level 2",
    pages: "0 / 12 Pages",
  image: "/images/pricing-adventure-bg.png",
    slug: "lost-in-the-rain",
    badge: "New",
  },
  {
    title: "The Hidden Lighthouse",
    level: "Level 3",
    pages: "0 / 15 Pages",
    image: "/images/pricing-adventure-bg.png",
    slug: "the-hidden-lighthouse",
  },
  {
    title: "The Forgotten Map",
    level: "Level 4",
    pages: "0 / 14 Pages",
    image: "/images/pricing-adventure-bg.png",
    slug: "the-forgotten-map",
  },
  {
    title: "The Secret Cave",
    level: "Level 5",
    pages: "0 / 16 Pages",
    image: "/images/pricing-adventure-bg.png",
    slug: "the-secret-cave",
  },
  {
    title: "The Brave Discovery",
    level: "Level 6",
    pages: "0 / 18 Pages",
    image: "/images/pricing-adventure-bg.png",
    slug: "the-brave-discovery",
  },
];

export default function HomePage() {
  return (
    <main className="adventureHome">
      <section className="homeIntro">
        <h1>Your Library</h1>
        <p>Choose a story and keep your adventure going.</p>

        <div className="libraryTabs">
          <button>▦ All Books</button>
          <button>▶ In Progress</button>
          <button>✓ Completed</button>
        </div>
      </section>

      <section className="homeContent">
        <div className="bookGridHome">
          {books.map((book) => (
            <Link href={`/books/${book.slug}`} className="adventureBookCard" key={book.slug}>
              <img src={book.image} alt={book.title} />

              {book.badge && <em>{book.badge}</em>}

              <div className="bookOverlay">
                <h2>{book.title}</h2>
                <p>{book.level}</p>

                <div className="progressBox">
                  <div />
                  <span>{book.pages}</span>
                </div>
              </div>
            </Link>
          ))}

          <div className="unlockBox">
            ⭐
            <div>
              <b>Keep reading to unlock new stories!</b>
              <p>New books, rewards, and adventures await.</p>
            </div>
          </div>
        </div>

       <div className="mapProgress">
  <div className="levelBubble levelSix">6</div>
  <div className="levelBubble levelFive">5</div>
  <div className="levelBubble levelFour">4</div>
  <div className="levelBubble levelThree">3</div>
  <div className="levelBubble levelTwo">2</div>

  <div className="kidMarker">
    <img src="/luke-character.png" alt="Luke" />
    <span>1</span>
    <b>⭐⭐⭐</b>
  </div>
</div>
      </section>
    </main>
  );
}