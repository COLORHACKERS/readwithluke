"use client";

import { FormEvent, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ReaderEmbeddedCheckout from "@/app/components/ReaderEmbeddedCheckout";
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
      "No. Your private partner invitation includes 30 days of access with no charge today.",
  },
  {
    question: "When will I be charged?",
    answer:
      "After your 30-day partner pass ends, your membership will continue at $9.99 per month unless you cancel before then.",
  },
  {
    question: "Can I cancel before the 30 days end?",
    answer:
      "Yes. You can cancel before your 30-day partner pass ends so you will not be charged.",
  },
  {
    question: "Who is this page for?",
    answer:
      "This private page is for invited affiliates, influencers, creators and promotional partners.",
  },
];

const partnerSteps = [
  {
    number: "1",
    image: "/images/luke-trial-signup.png",
    title: "Start Your Pass",
    text: "Create your partner account and securely add your payment details. You will not be charged today.",
  },
  {
    number: "2",
    image: "/images/luke-reading-activities.png",
    title: "Explore Everything",
    text: "Read stories, discover learning adventures and experience the full platform.",
  },
  {
    number: "3",
    image: "/images/luke-trial-reminder30.png",
    title: "We’ll Remind You",
    text: "We’ll remind you before your 30-day partner pass ends so there are no surprises.",
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
    text: "Experience creative activities and learning adventures.",
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
    title: "Cancel Anytime",
    text: "Cancel before your pass ends to avoid the monthly membership charge.",
  },
];

function EyeIcon({
  hidden,
}: {
  hidden: boolean;
}) {
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

export default function PartnerPassClient({
  initiallyUnlocked,
}: PartnerPassClientProps) {
  /* PRIVATE PAGE PASSWORD */
  const [unlocked, setUnlocked] =
    useState(initiallyUnlocked);

  const [
    invitationPassword,
    setInvitationPassword,
  ] = useState("");

  const [unlocking, setUnlocking] =
    useState(false);

  const [unlockError, setUnlockError] =
    useState("");

  /* PAGE */
  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  /* ACCOUNT SIGNUP */
  const [email, setEmail] =
    useState("");

  const [
    accountPassword,
    setAccountPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formError, setFormError] =
    useState("");

  const [
    showCheckout,
    setShowCheckout,
  ] = useState(false);

  const [
    checkoutEmail,
    setCheckoutEmail,
  ] = useState("");

  const passwordsMatch =
    confirmPassword.length > 0 &&
    accountPassword === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    accountPassword !== confirmPassword;

  async function handleUnlock(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!invitationPassword.trim()) {
      setUnlockError(
        "Please enter the invitation password."
      );
      return;
    }

    setUnlocking(true);
    setUnlockError("");

    const result =
      await unlockPartnerPass(
        invitationPassword
      );

    if (!result.success) {
      setUnlockError(
        result.error ||
          "Unable to unlock this page."
      );

      setUnlocking(false);
      return;
    }

    setUnlocked(true);
    setUnlocking(false);
  }

  function scrollToSignup() {
    document
      .getElementById(
        "partner-pass-signup"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  function startSecurePayment() {
    setFormError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setFormError(
        "Please enter the partner email."
      );
      return;
    }

    if (accountPassword.length < 6) {
      setFormError(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (
      accountPassword !==
      confirmPassword
    ) {
      setFormError(
        "Your passwords do not match."
      );
      return;
    }

    /*
     * Temporarily store signup information
     * in this browser tab.
     *
     * The Supabase account will only be
     * created after Stripe confirms the
     * payment method.
     */
    sessionStorage.setItem(
      "rwl-pending-email",
      cleanEmail
    );

    sessionStorage.setItem(
      "rwl-pending-password",
      accountPassword
    );

    sessionStorage.setItem(
      "rwl-pending-plan",
      "partner30"
    );

    setCheckoutEmail(cleanEmail);
    setShowCheckout(true);

    setTimeout(() => {
      document
        .getElementById(
          "partner-pass-signup"
        )
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

            <h1>
              Enter Your Invitation Password
            </h1>

            <p>
              This private 30-day adventure
              pass is reserved for invited
              affiliates, creators and
              promotional partners.
            </p>

            <form onSubmit={handleUnlock}>
              <label htmlFor="partner-password">
                Invitation password
              </label>

              <input
                id="partner-password"
                type="password"
                value={
                  invitationPassword
                }
                onChange={(event) =>
                  setInvitationPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
              />

              {unlockError && (
                <p className="partnerPasswordError">
                  {unlockError}
                </p>
              )}

              <button
                type="submit"
                disabled={unlocking}
              >
                {unlocking
                  ? "Checking..."
                  : "Unlock 30-Day Pass"}
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
              <span>
                Free for 30 Days!
              </span>
            </h1>

            <p className="partnerPassDescription">
              Explore the Read With Luke
              experience with 30 days of
              private partner access.
              Discover illustrated stories,
              playful learning adventures
              and a safe space created for
              curious children.
            </p>

            <div className="partnerPassQuickBenefits">
              <div>
                <img
                  src="/images/benefit-unlimited-stories.png"
                  alt=""
                />
                <span>
                  Unlimited Stories
                </span>
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
                <span>
                  Coins & Rewards
                </span>
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
              onClick={scrollToSignup}
            >
              Start My 30-Day Partner Pass
            </button>

            <p className="partnerPassFinePrint">
              🔒 No charge today. Cancel
              before your 30-day pass ends.
            </p>
          </div>

          <aside className="partnerPassFaq">
            <p className="partnerPassFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map(
              (item, index) => {
                const isOpen =
                  openFaq === index;

                return (
                  <div
                    className="partnerPassFaqItem"
                    key={item.question}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen
                            ? null
                            : index
                        )
                      }
                      aria-expanded={
                        isOpen
                      }
                    >
                      <span>
                        {item.question}
                      </span>

                      <span>
                        {isOpen
                          ? "−"
                          : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <p>
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              }
            )}
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
              {partnerSteps.map(
                (step) => (
                  <article
                    className="partnerPassStep"
                    key={step.number}
                  >
                    <span className="partnerPassStepNumber">
                      {step.number}
                    </span>

                    <img
                      src={step.image}
                      alt=""
                    />

                    <div>
                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.text}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>

            <div className="partnerPassSectionHeading partnerBenefitsHeading">
              <span />

              <h2>
                What Your Partner Pass
                Includes
              </h2>

              <span />
            </div>

            <div className="partnerPassBenefitGrid">
              {partnerBenefits.map(
                (benefit) => (
                  <article
                    className="partnerPassBenefit"
                    key={benefit.title}
                  >
                    <img
                      src={benefit.image}
                      alt=""
                    />

                    <h3>
                      {benefit.title}
                    </h3>

                    <p>
                      {benefit.text}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>

          <aside
            className="partnerPassSignup"
            id="partner-pass-signup"
          >
            <p className="partnerPassSignupEyebrow">
              30-DAY PARTNER PASS
            </p>

            <h2>
              Private Unlimited Access
            </h2>

            {!showCheckout ? (
              <>
                <div className="partnerPassFormFields">
                  <label htmlFor="partner-email">
                    Partner Email
                  </label>

                  <input
                    id="partner-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="partner@email.com"
                    autoComplete="email"
                  />

                  <label htmlFor="partner-account-password">
                    Password
                  </label>

                  <div className="partnerPassPasswordField">
                    <input
                      id="partner-account-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        accountPassword
                      }
                      onChange={(event) =>
                        setAccountPassword(
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
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon
                        hidden={
                          showPassword
                        }
                      />
                    </button>
                  </div>

                  <label htmlFor="partner-confirm-password">
                    Confirm Password
                  </label>

                  <div className="partnerPassPasswordField">
                    <input
                      id="partner-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
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
                          (current) =>
                            !current
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

                  {passwordsMatch && (
                    <p className="partnerPassPasswordMatch partnerPassPasswordSuccess">
                      ✓ Passwords match
                    </p>
                  )}

                  {passwordsDoNotMatch && (
                    <p className="partnerPassPasswordMatch partnerPassPasswordError">
                      ✕ Passwords do not
                      match
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="partnerPassFormError">
                    {formError}
                  </p>
                )}

                <div className="partnerPassSecureBox">
                  <span>🔒</span>

                  <div>
                    <strong>
                      Secure Credit Card
                      Information
                    </strong>

                    <p>
                      Your card information
                      is securely handled by
                      Stripe. Read With Luke
                      never stores your card
                      number.
                    </p>
                  </div>
                </div>

                <div className="partnerPassChargeBox">
                  <span>
                    Today’s Charge
                  </span>

                  <strong>
                    $0.00
                  </strong>
                </div>

                <p className="partnerPassSignupNote">
                  Your card will not be
                  charged until your 30-day
                  partner pass ends. Then
                  your membership continues
                  at $9.99/month unless
                  canceled.
                </p>

                <button
                  type="button"
                  className="partnerPassCheckoutButton"
                  onClick={
                    startSecurePayment
                  }
                  disabled={
                    !email.trim() ||
                    accountPassword.length <
                      6 ||
                    accountPassword !==
                      confirmPassword
                  }
                >
                  Continue to Secure Payment
                </button>
              </>
            ) : (
              <>
                <div className="partnerPassCheckoutSummary">
                  <div>
                    <span>
                      ACCOUNT EMAIL
                    </span>

                    <strong>
                      {checkoutEmail}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={
                      changeInformation
                    }
                  >
                    Change
                  </button>
                </div>

                <div className="partnerPassEmbeddedStripe">
                  <ReaderEmbeddedCheckout
                    email={
                      checkoutEmail
                    }
                    plan="partner30"
                  />
                </div>
              </>
            )}

            <p className="partnerPassTerms">
              By starting your pass, you
              agree to our{" "}
              <a href="/terms">
                Terms of Use
              </a>{" "}
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
