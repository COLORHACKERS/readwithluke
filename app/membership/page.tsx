import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./membership.css";

export const metadata: Metadata = {
  title: "Membership Options | Read With Luke",
  description:
    "Choose a Read With Luke reader membership or give three months of stories and learning as a gift.",
  alternates: {
    canonical: "https://readwithluke.com/membership",
  },
  openGraph: {
    title: "Membership Options | Read With Luke",
    description:
      "Choose a reader membership or give Read With Luke as a gift.",
    url: "https://readwithluke.com/membership",
    siteName: "Read With Luke",
    type: "website",
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
            someone special the gift of stories, imagination, and
            learning.
          </p>
        </section>

        <section className="membershipOptions">
          {/* Reader Membership */}
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
              <strong>$9.99</strong>
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
              $9.99 per month after the 7-day free trial. Cancel
              anytime.
            </small>
          </article>

          {/* Gift Membership */}
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
              <strong>$19.99</strong>
              <span>for 3 months of access</span>
            </div>

            <p className="membershipGiftRenewal">
              Then $4.99 per month
            </p>

            <div className="membershipBenefits">
              <p>✓ Three months of full access included</p>
              <p>✓ Unlimited books and learning adventures</p>
              <p>✓ The recipient is not asked for payment</p>
              <p>✓ Continues for $4.99 per month afterward</p>
            </div>

            <Link
              href="/gift"
              className="membershipButton membershipGiftButton"
            >
              GIVE A MEMBERSHIP
            </Link>

            <small>
              The purchaser pays $19.99 for the first three months,
              then $4.99 per month unless canceled.
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
