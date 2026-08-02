"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./membership.css";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Will I be charged today?",
    answer:
      "No. Your card is saved securely by Stripe, but you will not be charged until your 7-day trial ends.",
  },
  {
    question: "When will I be charged?",
    answer:
      "Your first membership payment begins after your 7-day free trial.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel before your trial ends or anytime after your membership begins.",
  },
  {
    question: "Is Read With Luke safe for children?",
    answer:
      "Yes. Read With Luke is designed as a positive, family-friendly reading and learning experience without outside advertisements.",
  },
];

const howItWorks = [
  {
    number: "1",
    image: "/images/luke-trial-signup.png",
    title: "Start Your Free Trial",
    text: "Create your parent account and securely add your payment details. You will not be charged today.",
  },
  {
    number: "2",
    image: "/images/luke-reading-activities.png",
    title: "Explore the Adventures",
    text: "Enjoy illustrated stories, learning adventures and activities with your child.",
  },
  {
    number: "3",
    image: "/images/luke-trial-reminder.png",
    title: "We’ll Remind You",
    text: "We’ll send you a reminder before the trial ends so there are no surprises.",
  },
];

const benefits = [
  {
    image: "/images/benefit-unlimited-stories.png",
    title: "Unlimited Stories",
    text: "Magical illustrated adventures for curious young readers.",
  },
  {
    image: "/images/benefit-learning.png",
    title: "Learning Adventures",
    text: "Kid-friendly science, nature, history and discovery stories.",
  },
  {
    image: "/images/benefit-activities.png",
    title: "Fun Activities",
    text: "Creative activities that extend reading and learning.",
  },
  {
    image: "/images/benefit-coins.png",
    title: "Coins & Rewards",
    text: "Celebrate progress and help children stay motivated.",
  },
  {
    image: "/images/benefit-safe.png",
    title: "Safe for Kids",
    text: "A positive and family-friendly space without outside ads.",
  },
  {
    image: "/images/benefit-cancel.png",
    title: "Cancel Anytime",
    text: "Manage or cancel your membership without hassle.",
  },
];

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function startTrial() {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    alert("Please enter the parent or guardian email.");
    return;
  }

  const signupUrl =
    `/signup?email=${encodeURIComponent(cleanEmail)}` +
    `&plan=monthly`;

  window.location.href = signupUrl;
}
    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          plan: "monthly",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to start checkout.");
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      alert(message);
      setLoading(false);
    }
  }

  return (
    <div className="membershipPage">
      <Header />

      <main className="membershipMain">
        <section className="membershipHero">
          <div className="membershipHeroCopy">
            <p className="membershipEyebrow">7-DAY ADVENTURE PASS</p>

            <h1>
              Try Read With Luke
              <span>Free for 7 Days!</span>
            </h1>

            <p className="membershipHeroDescription">
              Give your child access to magical stories and playful learning
              adventures. No charge today. Cancel before billing begins.
            </p>

            <div className="membershipHeroBenefits">
              <div>
                <img
                  src="/images/benefit-unlimited-stories.png"
                  alt=""
                />
                <span>Unlimited Stories</span>
              </div>

              <div>
                <img
                  src="/images/benefit-activities.png"
                  alt=""
                />
                <span>Fun Activities</span>
              </div>

              <div>
                <img
                  src="/images/benefit-coins.png"
                  alt=""
                />
                <span>Coins & Rewards</span>
              </div>

              <div>
                <img
                  src="/images/benefit-safe.png"
                  alt=""
                />
                <span>Kid-Friendly</span>
              </div>
            </div>

            <button
              type="button"
              className="membershipPaintButton"
              onClick={() =>
                document
                  .getElementById("membership-signup")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start My 7-Day Free Trial
            </button>

            <p className="membershipFinePrint">
              🔒 No charge today. Cancel before your trial ends.
            </p>
          </div>

          <aside className="membershipFaqPanel">
            <p className="membershipFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="membershipFaqItem" key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && <p>{item.answer}</p>}
                </div>
              );
            })}
          </aside>
        </section>

        <section className="membershipLowerPanel">
          <div className="membershipInformation">
            <div className="membershipSectionHeading">
              <span />
              <h2>How It Works</h2>
              <span />
            </div>

            <div className="membershipSteps">
              {howItWorks.map((step) => (
                <article className="membershipStep" key={step.number}>
                  <span className="membershipStepNumber">{step.number}</span>

                  <img src={step.image} alt="" />

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="membershipSectionHeading membershipBenefitsHeading">
              <span />
              <h2>Why Families Love Read With Luke</h2>
              <span />
            </div>

            <div className="membershipBenefitGrid">
              {benefits.map((benefit) => (
                <article className="membershipBenefit" key={benefit.title}>
                  <img src={benefit.image} alt="" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="membershipSignup" id="membership-signup">
            <p className="membershipSignupEyebrow">7-DAY FREE TRIAL</p>
            <h2>Unlimited Access</h2>

            <label htmlFor="membership-email">
              Parent or Guardian Email
            </label>

            <input
              id="membership-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="parent@email.com"
              autoComplete="email"
            />

            <div className="membershipSecureBox">
              <span>🔒</span>

              <div>
                <strong>Secure Stripe Checkout</strong>
                <p>
                  Your payment details are entered securely on Stripe. Read
                  With Luke does not store your card number.
                </p>
              </div>
            </div>

            <div className="membershipChargeBox">
              <span>Today’s Charge</span>
              <strong>$0.00</strong>
            </div>

            <p className="membershipSignupNote">
              Your card will not be charged until your 7-day trial ends.
            </p>

            <button
              type="button"
              className="membershipCheckoutButton"
              onClick={startTrial}
              disabled={loading}
            >
              {loading
                ? "Opening Secure Checkout..."
                : "Start My 7-Day Free Trial"}
            </button>

            <p className="membershipTerms">
              By starting your trial, you agree to our{" "}
              <a href="/terms">Terms of Use</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
