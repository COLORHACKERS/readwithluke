import Link from "next/link";

export default function MembershipPage() {
  return (
    <main className="membershipPage">
      <section className="membershipHero">
        <p className="eyebrow">Read With Luke Membership</p>
        <h1>Unlimited magical reading adventures.</h1>
        <p>
          New stories, read-aloud pages, stickers, puzzles, and rewards for young readers.
        </p>
      </section>

      <section className="plansGrid">
        <div className="planCard">
          <h2>Little Reader</h2>
          <p className="price">$4.99/mo</p>
          <p>Perfect for one child.</p>
          <ul>
            <li>Unlimited story reading</li>
            <li>Read aloud mode</li>
            <li>Sticker rewards</li>
          </ul>
          <Link href="/signup" className="planButton">
            Start Reading
          </Link>
        </div>

        <div className="planCard featuredPlan">
          <h2>Family Adventure</h2>
          <p className="price">$9.99/mo</p>
          <p>Best for families.</p>
          <ul>
            <li>Unlimited stories</li>
            <li>Multiple reader profiles</li>
            <li>Puzzles and games</li>
            <li>Premium rewards</li>
          </ul>
          <Link href="/signup" className="planButton">
            Join Now
          </Link>
        </div>
      </section>
    </main>
  );
}