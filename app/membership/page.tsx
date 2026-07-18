import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./membership.css";

export const metadata: Metadata = {
  title: "Membership Options | Read With Luke",
  description:
    "Choose a Read With Luke reader membership or give a membership as a gift.",
  alternates: {
    canonical: "https://readwithluke.com/membership",
  },
};

export default function MembershipPage() {
  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipHero">
          <span className="membershipEyebrow">
            JOIN READ WITH LUKE
          </span>

          <h1>Choose Your Adventure</h1>

          <p>
            Start a reader membership for your family or give
            someone special the gift of stories and learning.
          </p>
        </section>

        <section className="membershipOptions">
          <article className="membershipCard membershipReaderCard">
            <div className="membershipCardTop">
              <span className="membershipCardLabel">
                FOR YOUR FAMILY
              </span>

              <h2>Reader Membership</h2>

              <p className="membershipCardDescription">
                Enjoy unlimited access to Read With Luke books and
                learning adventures.
              </p>
            </div>

            <div className="membershipPrice">
              <strong>$4.99</strong>
              <span>/ month</span>
            </div>

            <p className="membershipTrial">
              Start with a 7-day free trial.
            </p>

            <div className="membershipBenefits">
              <p>✓ Unlimited digital books</p>
              <p>✓ Learn With Luke adventures</p>
              <p>✓ New stories and learning posts</p>
              <p>✓ Read anywhere on your devices</p>
            </div>

            <Link
              href="/signup"
              className="membershipButton membershipPrimaryButton"
            >
              START FREE TRIAL
            </Link>

            <small>
              Cancel before the trial ends to avoid being charged.
            </small>
          </article>

          <article className="membershipCard membershipGiftCard">
            <div className="membershipGiftBadge">
              A GREAT GIFT
            </div>

            <div className="membershipCardTop">
              <span className="membershipCardLabel">
                FOR SOMEONE SPECIAL
              </span>

              <h2>Gift a Membership</h2>

              <p className="membershipCardDescription">
                Give a child access to imaginative stories,
                fascinating discoveries, and screen time parents
                can feel good about.
              </p>
            </div>

            <div className="membershipPrice membershipGiftPrice">
              <strong>Gift</strong>
              <span>Choose a plan</span>
            </div>

            <div className="membershipBenefits">
              <p>✓ No subscription for the recipient</p>
              <p>✓ Choose the gift membership length</p>
              <p>✓ Delivered as a special gift</p>
              <p>✓ Full books and learning access</p>
            </div>

            <Link
              href="/gift"
              className="membershipButton membershipGiftButton"
            >
              GIVE A MEMBERSHIP
            </Link>

            <small>
              The recipient will not be asked for payment.
            </small>
          </article>
        </section>

        <section className="membershipBottom">
          <h2>Stories That Make Screen Time Count</h2>

          <p>
            Read With Luke combines cinematic storytelling,
            imagination, discovery, and learning in one growing
            digital library for children.
          </p>

          <Link href="/library">
            Explore the library
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
