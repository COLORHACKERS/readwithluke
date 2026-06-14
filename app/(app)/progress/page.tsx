import { Clock, Star, Trophy } from "lucide-react";

export default function ProgressPage() {
  return (
    <section className="comingPage">
      <p className="eyebrow">COMING SOON</p>

      <h1>My Progress</h1>

      <p>Track reading streaks, finished stories, badges, and favorite books.</p>

      <div className="comingCards">
        <div>
          <Clock />
          <h3>Reading Time</h3>
        </div>

        <div>
          <Star />
          <h3>Badges</h3>
        </div>

        <div>
          <Trophy />
          <h3>Achievements</h3>
        </div>
      </div>
    </section>
  );
}
