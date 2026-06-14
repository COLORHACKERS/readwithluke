import { Flag, Flame, Star } from "lucide-react";

export default function QuestsPage() {
  return (
    <section className="comingPage">
      <p className="eyebrow">COMING SOON</p>

      <h1>Quests</h1>

      <p>Daily reading challenges, story missions, and fun adventure goals.</p>

      <div className="comingCards">
        <div>
          <Flag />
          <h3>Daily Quests</h3>
        </div>

        <div>
          <Flame />
          <h3>Streaks</h3>
        </div>

        <div>
          <Star />
          <h3>Bonus Goals</h3>
        </div>
      </div>
    </section>
  );
}
