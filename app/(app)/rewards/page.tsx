import { Gift, Star, Trophy } from "lucide-react";

export default function RewardsPage() {
  return (
    <section className="comingPage">
      <p className="eyebrow">COMING SOON</p>

      <h1>Rewards</h1>

      <p>Earn stickers, badges, and fun prizes as you read more stories.</p>

      <div className="comingCards">
        <div>
          <Gift />
          <h3>Stickers</h3>
        </div>

        <div>
          <Star />
          <h3>Stars</h3>
        </div>

        <div>
          <Trophy />
          <h3>Trophies</h3>
        </div>
      </div>
    </section>
  );
}
