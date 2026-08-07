"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ReaderEmbeddedCheckout from "@/app/components/ReaderEmbeddedCheckout";
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

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2 2 0 002.7 2.7" />
      <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9.5 5 9.5 5a15.6 15.6 0 01-3.1 3.8" />
      <path d="M6.6 6.6C4 8.3 2.5 11 2.5 11S6.5 16 12 16c1.2 0 2.3-.2 3.3-.6" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12S6.5 7 12 7s9.5 5 9.5 5-4 5-9.5 5-9.5-5-9.5-5z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formError, setFormError] = useState("");

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");

  const passwordsMatch =
  confirmPassword.length > 0 &&
  password === confirmPassword;

const passwordsDoNotMatch =
  confirmPassword.length > 0 &&
  password !== confirmPassword;

  function scrollToSignup() {
    document
      .getElementById("membership-signup")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  function startSecurePayment() {
    setFormError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setFormError(
        "Please enter the parent or guardian email."
      );
      return;
    }

    if (password.length < 6) {
      setFormError(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Your passwords do not match.");
      return;
    }

    /*
     * Keep these temporarily in this browser tab.
     * They will be used after Stripe confirms the checkout.
     */
    sessionStorage.setItem(
      "rwl-pending-email",
      cleanEmail
    );

    sessionStorage.setItem(
      "rwl-pending-password",
      password
    );

    sessionStorage.setItem(
      "rwl-pending-plan",
      "monthly"
    );

    setCheckoutEmail(cleanEmail);
    setShowCheckout(true);

    setTimeout(() => {
      document
        .getElementById("membership-signup")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function changeInformation() {
    setShowCheckout(false);
    setCheckoutEmail("");
  }

  return (
    <div className="membershipPage">
      <Header />

      <main className="membershipMain">
        <section className="membershipHero">
          <div className="membershipHeroCopy">
            <p className="membershipEyebrow">
              7-DAY ADVENTURE PASS
            </p>

            <h1>
              Try Read With Luke
              <span>Free for 7 Days!</span>
            </h1>

            <p className="membershipHeroDescription">
              Give your child access to magical stories and
              playful learning adventures. No charge today.
              Cancel before billing begins.
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
              onClick={scrollToSignup}
            >
              Start My 7-Day Free Trial
            </button>

            <p className="membershipFinePrint">
              🔒 No charge today. Cancel before your trial
              ends.
            </p>
          </div>

          <aside className="membershipFaqPanel">
            <p className="membershipFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  className="membershipFaqItem"
                  key={item.question}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
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
                <article
                  className="membershipStep"
                  key={step.number}
                >
                  <span className="membershipStepNumber">
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

            <div className="membershipSectionHeading membershipBenefitsHeading">
              <span />
              <h2>
                Why Families Love Read With Luke
              </h2>
              <span />
            </div>

            <div className="membershipBenefitGrid">
              {benefits.map((benefit) => (
                <article
                  className="membershipBenefit"
                  key={benefit.title}
                >
                  <img
                    src={benefit.image}
                    alt=""
                  />

                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside
            className="membershipSignup"
            id="membership-signup"
          >
            <p className="membershipSignupEyebrow">
              7-DAY FREE TRIAL
            </p>

            <h2>Unlimited Access</h2>

            {!showCheckout ? (
              <>
                <div className="membershipFormFields">
                  <label htmlFor="membership-email">
                    Parent or Guardian Email
                  </label>

                  <input
                    id="membership-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="parent@email.com"
                    autoComplete="email"
                  />

                  <label htmlFor="membership-password">
                    Password
                  </label>

                  <div className="membershipPasswordField">
                    <input
                      id="membership-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Create password"
                      autoComplete="new-password"
                      minLength={6}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon
                        hidden={showPassword}
                      />
                    </button>
                  </div>

                  <label htmlFor="membership-confirm-password">
                    Confirm Password
                  </label>

                  <div className="membershipPasswordField">
                    <input
                      id="membership-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      minLength={6}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon
                        hidden={
                          showConfirmPassword
                        }
                      />
                    </button>
                  </div>
                </div>
                {passwordsMatch && (
  <p className="passwordMatchMessage passwordMatchSuccess">
    ✓ Passwords match
  </p>
)}

{passwordsDoNotMatch && (
  <p className="passwordMatchMessage passwordMatchError">
    ✕ Passwords do not match
  </p>
)}

                {formError && (
                  <p className="membershipFormError">
                    {formError}
                  </p>
                )}

                <div className="membershipSecureBox">
                  <span>🔒</span>

                  <div>
                    <strong>
                      Secure Credit Card Information
                    </strong>

                    <p>
                      Your card information is
                      securely handled by Stripe.
                      Read With Luke never stores
                      your card number.
                    </p>
                  </div>
                </div>

                <div className="membershipChargeBox">
                  <span>Today’s Charge</span>
                  <strong>$0.00</strong>
                </div>

                <p className="membershipSignupNote">
                  Your card will not be charged until
                  your 7-day free trial ends.
                </p>

                <button
                  type="button"
                  className="membershipCheckoutButton"
                  onClick={startSecurePayment}
                >
                  Continue to Secure Payment
                </button>
              </>
            ) : (
              <>
                <div className="membershipCheckoutSummary">
                  <div>
                    <span>ACCOUNT EMAIL</span>
                    <strong>
                      {checkoutEmail}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={changeInformation}
                  >
                    Change
                  </button>
                </div>

                <div className="membershipEmbeddedStripe">
                  <ReaderEmbeddedCheckout
                    email={checkoutEmail}
                    plan="monthly"
                  />
                </div>
              </>
            )}

            <p className="membershipTerms">
              By starting your trial, you agree to
              our <a href="/terms">Terms of Use</a>{" "}
              and{" "}
              <a href="/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
