"use client";

import { FormEvent, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { unlockPartnerPass } from "./actions";

type PartnerPassClientProps = {
  initiallyUnlocked: boolean;
};

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Will I be charged today?",
    answer:
      "No. This private partner invitation includes 30 days of access with no charge today.",
  },
  {
    question: "When will I be charged?",
    answer:
      "You will not be charged unless you later choose to begin a paid membership.",
  },
  {
    question: "Who is this page for?",
    answer:
      "This page is only for invited affiliates, influencers, creators and promotional partners.",
  },
  {
    question: "Can I share the password?",
    answer:
      "Please do not publicly share the password or this private invitation page.",
  },
];

const partnerSteps = [
  {
    number: "1",
    image: "/images/luke-trial-signup.png",
    title: "Start Your Pass",
    text: "Create your invited partner account and begin exploring immediately.",
  },
  {
    number: "2",
    image: "/images/luke-reading-activities.png",
    title: "Explore Everything",
    text: "Read stories, discover learning adventures and experience the platform.",
  },
  {
    number: "3",
    image: "/images/luke-trial-reminder.png",
    title: "Share Honestly",
    text: "Create genuine content based on your experience with Read With Luke.",
  },
];

const partnerBenefits = [
  {
    image: "/images/benefit-unlimited-stories.png",
    title: "Unlimited Stories",
    text: "Explore the full collection of illustrated adventures.",
  },
  {
    image: "/images/benefit-learning.png",
    title: "Unlimited Learning",
    text: "Discover science, nature, history and educational stories.",
  },
  {
    image: "/images/benefit-activities.png",
    title: "Activities",
    text: "Experience the creative activities and printable adventures.",
  },
  {
    image: "/images/benefit-coins.png",
    title: "Coins & Rewards",
    text: "See how children earn rewards while they read and learn.",
  },
  {
    image: "/images/benefit-safe.png",
    title: "Safe for Kids",
    text: "A positive, child-friendly experience without outside ads.",
  },
  {
    image: "/images/benefit-cancel.png",
    title: "No Obligation",
    text: "The partner pass does not automatically start a paid membership.",
  },
];

export default function PartnerPassClient({
  initiallyUnlocked,
}: PartnerPassClientProps) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [password, setPassword] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setError("Please enter the invitation password.");
      return;
    }

    setUnlocking(true);
    setError("");

    const result = await unlockPartnerPass(password);

    if (!result.success) {
      setError(result.error || "Unable to unlock this page.");
      setUnlocking(false);
      return;
    }

    setUnlocked(true);
    setUnlocking(false);
  }

  function startPartnerPass() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    setStarting(true);

    const signupUrl =
      `/signup?email=${encodeURIComponent(cleanEmail)}` +
      `&plan=partner30`;

    window.location.href = signupUrl;
  }

  if (!unlocked) {
    return (
      <div className="partnerPasswordPage">
        <Header />

        <main className="partnerPasswordMain">
          <section className="partnerPasswordCard">
            <img
              src="/images/luke-trial-signup.png"
              alt="Luke welcoming an invited Read With Luke partner"
            />

            <p className="partnerPasswordEyebrow">
              PRIVATE PARTNER INVITATION
            </p>

            <h1>Enter Your Invitation Password</h1>

            <p>
              This private 30-day adventure pass is reserved for invited
              affiliates, creators and promotional partners.
            </p>

            <form onSubmit={handleUnlock}>
              <label htmlFor="partner-password">
                Invitation password
              </label>

              <input
                id="partner-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />

              {error && (
                <p className="partnerPasswordError">{error}</p>
              )}

              <button type="submit" disabled={unlocking}>
                {unlocking ? "Checking..." : "Unlock 30-Day Pass"}
              </button>
            </form>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="partnerPassPage">
      <Header />

      <main className="partnerPassMain">
        <section className="partnerPassHero">
          <div className="partnerPassCopy">
            <p className="partnerPassEyebrow">
              PRIVATE 30-DAY ADVENTURE PASS
            </p>

            <h1>
              Try Read With Luke
              <span>Free for 30 Days!</span>
            </h1>

            <p className="partnerPassDescription">
              Explore the Read With Luke experience with 30 days of private
              partner access. Discover illustrated stories, playful learning
              adventures and a safe space created for curious children.
            </p>

            <div className="partnerPassQuickBenefits">
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
                <span>Activities</span>
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
              className="partnerPassHeroButton"
              onClick={() =>
                document
                  .getElementById("partner-pass-signup")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start My 30-Day Partner Pass
            </button>

            <p className="partnerPassFinePrint">
              🔒 Private invitation. No charge today.
            </p>
          </div>

          <aside className="partnerPassFaq">
            <p className="partnerPassFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="partnerPassFaqItem" key={item.question}>
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

        <section className="partnerPassLower">
          <div className="partnerPassInformation">
            <div className="partnerPassSectionHeading">
              <span />
              <h2>How It Works</h2>
              <span />
            </div>

            <div className="partnerPassSteps">
              {partnerSteps.map((step) => (
                <article className="partnerPassStep" key={step.number}>
                  <span className="partnerPassStepNumber">
                    {step.number}
                  </span>

                  <img src={step.image} alt="" />

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="partnerPassSectionHeading partnerBenefitsHeading">
              <span />
              <h2>What Your Partner Pass Includes</h2>
              <span />
            </div>

            <div className="partnerPassBenefitGrid">
              {partnerBenefits.map((benefit) => (
                <article
                  className="partnerPassBenefit"
                  key={benefit.title}
                >
                  <img src={benefit.image} alt="" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside
            className="partnerPassSignup"
            id="partner-pass-signup"
          >
            <p className="partnerPassSignupEyebrow">
              30-DAY PARTNER PASS
            </p>

            <h2>Private Unlimited Access</h2>

            <label htmlFor="partner-email">
              Partner Email
            </label>

            <input
              id="partner-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="partner@email.com"
              autoComplete="email"
            />

            <div className="partnerPassSecureBox">
              <span>🔒</span>

              <div>
                <strong>Private Partner Access</strong>
                <p>
                  This invitation is reserved for approved Read With Luke
                  affiliates and creators.
                </p>
              </div>
            </div>

            <div className="partnerPassChargeBox">
              <span>Today’s Charge</span>
              <strong>$0.00</strong>
            </div>

            <p className="partnerPassSignupNote">
              Your private partner pass includes 30 days of access.
            </p>

            <button
              type="button"
              className="partnerPassCheckoutButton"
              onClick={startPartnerPass}
              disabled={starting}
            >
              {starting
                ? "Opening Signup..."
                : "Start My 30-Day Partner Pass"}
            </button>

            <p className="partnerPassTerms">
              This invitation may not be publicly shared or redistributed.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
