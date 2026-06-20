import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "../../home.css";
import "./membership.css";

export default function MembershipPage() {
  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipCard">
          <p className="membershipEyebrow">
            READ WITH LUKE MEMBERSHIP
          </p>

          <h1>
            READ FREE
            <br />
            UNTIL LAUNCH.
          </h1>

          <p className="membershipDescription">
            Create your account today and unlock unlimited access to every
            story, learning adventure, puzzle, reward, and future feature in
            Read With Luke.
          </p>

          <p className="membershipDescription">
            Membership is completely free until our official launch date.
            Your membership will automatically continue at $12.99/month after
            launch unless cancelled beforehand.
          </p>

          <div className="membershipPrice">
            <strong>$12.99</strong>
            <span>per month after launch</span>
          </div>

          <div className="membershipFeatures">
            <div>✓ Unlimited Story Reading</div>
            <div>✓ Learn With Luke</div>
            <div>✓ Read Aloud Mode</div>
            <div>✓ Rewards & Badges</div>
            <div>✓ Future Games & Puzzles</div>
            <div>✓ New Stories Every Month</div>
          </div>

          <Link href="/signup" className="membershipButton">
            START FREE MEMBERSHIP
          </Link>

          <p className="membershipFinePrint">
            No charge today. Cancel anytime before launch and you will never be charged.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

