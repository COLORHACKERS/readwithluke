"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./gift.css";

type GiftPlan = "gift-monthly" | "gift-yearly";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Who is this gift for?",
    answer:
      "Gift Reading is for anyone who wants to give a child access to Read With Luke stories and learning adventures.",
  },
  {
    question: "Who pays for the membership?",
    answer:
      "The gifter pays for the membership and receives payment receipts and billing information.",
  },
  {
    question: "Who creates the Read With Luke account?",
    answer:
      "The parent or guardian receives an invitation email and creates the account and password for the child.",
  },
  {
    question: "Can the gifter receive reading updates?",
    answer:
      "The gifter can request a monthly Read With Luke report card. The parent or guardian must approve the request before anything is shared.",
  },
  {
    question: "Does the gift membership renew?",
    answer:
      "Yes. Monthly gifts renew at $4.99 per month and yearly gifts renew at $49.99 per year until the gifter cancels.",
  },
];

const giftSteps = [
  {
    number: "1",
    image: "/images/gift-step-purchase.png",
    title: "Choose Your Gift",
    text: "Choose monthly or yearly access, enter your information and securely purchase the gift.",
  },
  {
    number: "2",
    image: "/images/gift-step-parent.png",
    title: "Guardian Activates It",
    text: "We email the parent or guardian a special invitation to create the child’s Read With Luke account.",
  },
  {
    number: "3",
    image: "/images/gift-step-adventure.png",
    title: "Share the Adventure",
    text: "The child gets access to stories, learning adventures, coins and rewards.",
  },
];

const giftBenefits = [
  {
    image: "/images/gift-benefit-meaningful.png",
    title: "A Meaningful Gift",
  },
  {
    image: "/images/gift-benefit-months.png",
    title: "Monthly or Yearly",
  },
  {
    image: "/images/benefit-coins.png",
    title: "Stories & Rewards",
  },
  {
    image: "/images/benefit-safe.png",
    title: "Family-Friendly",
  },
  {
    image: "/images/gift-benefit-email.png",
    title: "Optional Report Cards",
  },
];

export default function GiftReadingPage() {
  const [gifterName, setGifterName] = useState("");
  const [gifterEmail, setGifterEmail] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [relationship, setRelationship] = useState("");

  const [selectedPlan, setSelectedPlan] =
    useState<GiftPlan>("gift-monthly");

  const [
    progressReportRequested,
    setProgressReportRequested,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const isYearly =
    selectedPlan === "gift-yearly";

  const selectedPrice =
    isYearly ? "$49.99" : "$4.99";

  const selectedInterval =
    isYearly ? "year" : "month";

  async function startGiftCheckout() {
    const cleanGifterName =
      gifterName.trim();

    const cleanGifterEmail =
      gifterEmail.trim().toLowerCase();

    const cleanGuardianEmail =
      guardianEmail.trim().toLowerCase();

    if (!cleanGifterName) {
      alert("Please enter the gifter's name.");
      return;
    }

    if (!cleanGifterEmail) {
      alert("Please enter the gifter's email.");
      return;
    }

    if (!cleanGuardianEmail) {
      alert(
        "Please enter the parent or guardian's email."
      );
      return;
    }

    if (!relationship) {
      alert(
        "Please choose your relationship to the child."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/create-gift-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            gifterName:
              cleanGifterName,

            gifterEmail:
              cleanGifterEmail,

            guardianEmail:
              cleanGuardianEmail,

            relationship,

            progressReportRequested,

            plan: selectedPlan,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.url
      ) {
        throw new Error(
          data.error ||
            "Could not start gift checkout."
        );
      }

      window.location.href =
        data.url;
    } catch (error) {
      console.error(
        "Gift checkout error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not start gift checkout. Please try again."
      );

      setLoading(false);
    }
  }

  function scrollToGiftForm() {
    document
      .getElementById(
        "gift-checkout"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  const formReady =
    gifterName.trim().length > 0 &&
    gifterEmail.trim().length > 0 &&
    guardianEmail.trim().length > 0 &&
    relationship.length > 0;

  return (
    <div className="giftPage">
      <Header />

      <main className="giftMain">
        <section className="giftHero">
          <div className="giftHeroCopy">
            <p className="giftEyebrow">
              FAMILY GIFT MEMBERSHIP
            </p>

            <h1>
              Gift
              <span>Reading!</span>
            </h1>

            <p className="giftDescription">
              Give a child unlimited access
              to magical stories, playful
              learning adventures and a
              reading experience created
              just for kids.
            </p>

           <div className="giftPrice">
  <strong>
    $4.99
  </strong>

  <span>
    MONTHLY &nbsp; • &nbsp; $49.99/YEAR
  </span>
</div>

            <div className="giftQuickBenefits">
              <div>
                <img
                  src="/images/gift-starts-now.png"
                  alt=""
                />
                <span>
                  Starts Today
                </span>
              </div>

              <div>
                <img
                  src="/images/gift-parent-activates.png"
                  alt=""
                />
                <span>
                  Guardian Activates
                </span>
              </div>

              <div>
                <img
                  src="/images/gift-updates.png"
                  alt=""
                />
                <span>
                  Optional Report Cards
                </span>
              </div>

              <div>
                <img
                  src="/images/benefit-safe.png"
                  alt=""
                />
                <span>
                  Safe for Kids
                </span>
              </div>
            </div>

            <button
              type="button"
              className="giftHeroButton"
              onClick={scrollToGiftForm}
            >
              Gift Read With Luke
            </button>

            <p className="giftHeroFinePrint">
              ★ A meaningful reading gift
              for someone special.
            </p>
          </div>

          <aside className="giftFaqPanel">
            <p className="giftFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map(
              (item, index) => {
                const isOpen =
                  openFaq === index;

                return (
                  <div
                    className="giftFaqItem"
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

        <section className="giftLowerPanel">
          <div className="giftInformation">
            <div className="giftSectionHeading">
              <span />

              <h2>
                How It Works
              </h2>

              <span />
            </div>

            <div className="giftSteps">
              {giftSteps.map(
                (step) => (
                  <article
                    className="giftStep"
                    key={step.number}
                  >
                    <span className="giftStepNumber">
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

            <div className="giftSectionHeading giftBenefitsHeading">
              <span />

              <h2>
                Why Families Love
                Gift Reading
              </h2>

              <span />
            </div>

            <div className="giftBenefitGrid">
              {giftBenefits.map(
                (benefit) => (
                  <article
                    className="giftBenefit"
                    key={
                      benefit.title
                    }
                  >
                    <img
                      src={
                        benefit.image
                      }
                      alt=""
                    />

                    <h3>
                      {benefit.title}
                    </h3>
                  </article>
                )
              )}
            </div>
          </div>

          <aside
            className="giftCheckout"
            id="gift-checkout"
          >
            <p className="giftCheckoutEyebrow">
              GIFT READING
            </p>

            <h2>
              Give a Reading Adventure
            </h2>

            {/* PLAN */}

            <div className="giftPlanSelector">
              <button
                type="button"
                className={
                  selectedPlan ===
                  "gift-monthly"
                    ? "giftPlanOption active"
                    : "giftPlanOption"
                }
                onClick={() =>
                  setSelectedPlan(
                    "gift-monthly"
                  )
                }
              >
                <span>
                  MONTHLY
                </span>

                <strong>
                  $4.99
                </strong>

                <small>
                  / month
                </small>
              </button>

              <button
                type="button"
                className={
                  selectedPlan ===
                  "gift-yearly"
                    ? "giftPlanOption active"
                    : "giftPlanOption"
                }
                onClick={() =>
                  setSelectedPlan(
                    "gift-yearly"
                  )
                }
              >
                <span>
                  YEARLY
                </span>

                <strong>
                  $49.99
                </strong>

                <small>
                  / year
                </small>
              </button>
            </div>

            {/* GIFTER NAME */}

            <label htmlFor="gifterName">
              Gifter&apos;s Name
            </label>

            <input
              id="gifterName"
              type="text"
              className="giftInput"
              placeholder="Your name"
              value={gifterName}
              onChange={(event) =>
                setGifterName(
                  event.target.value
                )
              }
              autoComplete="name"
            />

            <p className="giftFieldNote">
              We&apos;ll tell the guardian
              who sent their Read With Luke
              gift.
            </p>

            {/* GIFTER EMAIL */}

            <label htmlFor="gifterEmail">
              Gifter&apos;s Email
            </label>

            <input
              id="gifterEmail"
              type="email"
              placeholder="you@email.com"
              value={gifterEmail}
              onChange={(event) =>
                setGifterEmail(
                  event.target.value
                )
              }
              autoComplete="email"
            />

            <p className="giftFieldNote">
              Your payment receipt, billing
              information and gift
              confirmation will be sent here.
            </p>

            {/* GUARDIAN EMAIL */}

            <label htmlFor="guardianEmail">
              Parent or Guardian Email
            </label>

            <input
              id="guardianEmail"
              type="email"
              placeholder="parent@email.com"
              value={guardianEmail}
              onChange={(event) =>
                setGuardianEmail(
                  event.target.value
                )
              }
              autoComplete="off"
            />

            <p className="giftFieldNote">
              We&apos;ll send the guardian
              an invitation to create the
              child&apos;s Read With Luke
              account.
            </p>

            {/* RELATIONSHIP */}

            <label htmlFor="relationship">
              Your Relationship to the Child
            </label>

            <select
              id="relationship"
              value={relationship}
              onChange={(event) =>
                setRelationship(
                  event.target.value
                )
              }
            >
              <option value="">
                Choose relationship
              </option>

              <option value="grandparent">
                Grandparent
              </option>

              <option value="aunt">
                Aunt
              </option>

              <option value="uncle">
                Uncle
              </option>

              <option value="godparent">
                Godparent
              </option>

              <option value="family_friend">
                Family Friend
              </option>

              <option value="family_member">
                Other Family Member
              </option>

              <option value="other">
                Other
              </option>
            </select>

            {/* REPORT CARD */}

            <label className="giftProgressOption">
              <input
                type="checkbox"
                checked={
                  progressReportRequested
                }
                onChange={(event) =>
                  setProgressReportRequested(
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>
                  Request a monthly Read
                  With Luke report card.
                </strong>

                <small>
                  The parent or guardian
                  will be asked to approve
                  sharing the child&apos;s
                  monthly reading progress
                  with you by email.
                </small>
              </span>
            </label>

            {/* CHARGE */}

            <div className="giftChargeBox">
              <span>
                Today&apos;s Charge
              </span>

              <strong>
                {selectedPrice}
              </strong>
            </div>

            <p className="giftCheckoutRenewal">
              You will be charged{" "}
              <strong>
                {selectedPrice}
              </strong>{" "}
              today. This gift membership
              renews every {selectedInterval}
              {" "}until canceled.
            </p>

            {/* CHECKOUT */}

            <button
              type="button"
              onClick={
                startGiftCheckout
              }
              className="giftCheckoutButton"
              disabled={
                !formReady ||
                loading
              }
            >
              {loading
                ? "Opening Secure Checkout..."
                : `Gift ${selectedPrice}/${selectedInterval}`}
            </button>

            <p className="giftCheckoutFinePrint">
              🔒 Secure payment powered by
              Stripe. The parent or guardian
              will never be asked for payment
              information.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
