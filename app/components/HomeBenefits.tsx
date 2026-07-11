
import Link from "next/link";
import "./home-benefits.css";

const benefits = [
  {
    icon: "📖",
    title: "Beautiful Stories",
    text: "Engaging stories that spark imagination and build reading confidence.",
  },
  {
    icon: "🧩",
    title: "Fun & Games",
    text: "Puzzles, games, and activities that make learning exciting.",
  },
  {
    icon: "🎓",
    title: "Learn & Explore",
    text: "Learning adventures that teach new things in a fun, easy way.",
  },
  {
    icon: "🪙",
    title: "Earn & Achieve",
    text: "Earn coins, badges, stickers, and rewards that celebrate progress.",
  },
  {
    icon: "❤️",
    title: "Made for Families",
    text: "A safe, positive place for children and a simple experience for parents.",
  },
];

export default function HomeBenefits() {
  return (
    <section className="homeBenefitsSection">
      <div className="homeBenefitsHeading">
        <p className="homeBenefitsEyebrow">WHY FAMILIES LOVE IT</p>

        <h2>The Best of Read With Luke</h2>

        <p>
          Everything your child needs to read, learn, play, and grow.
        </p>
      </div>

      <div className="homeBenefitsGrid">
        {benefits.map((benefit) => (
          <article className="homeBenefitCard" key={benefit.title}>
            <div className="homeBenefitIcon" aria-hidden="true">
              {benefit.icon}
            </div>

            <h3>{benefit.title}</h3>

            <p>{benefit.text}</p>
          </article>
        ))}
      </div>

      <div className="homeBenefitsActions">
        <Link href="/library" className="homeBenefitsPrimary">
          EXPLORE THE LIBRARY
        </Link>

        <Link href="/signup" className="homeBenefitsSecondary">
          JOIN READ WITH LUKE
        </Link>
      </div>
    </section>
  );
}s
