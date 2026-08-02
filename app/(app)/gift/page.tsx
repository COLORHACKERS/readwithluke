"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./gift.css";

type PendingGift = {
  parentEmail: string;
  relationship: string;
  progressEmails: boolean;
  familyConfirmed: boolean;
};

type FaqItem = {
  question: string;
  answer: string;
};

const PENDING_GIFT_KEY = "rwl-pending-gift";

const faqItems: FaqItem[] = [
  {
    question: "Who is this gift for?",
    answer:
      "This family gift membership is for a child and must be purchased by a grandparent, aunt, uncle, or another family member.",
  },
  {
    question: "Does the giver receive account access?",
    answer:
      "No. The child’s parent or guardian receives the activation instructions and manages the child’s account.",
  },
  {
    question: "Who sets up the child’s account?",
    answer:
      "The parent or guardian receives an email and completes the child’s Read With Luke setup.",
  },
  {
    question: "Can the giver receive updates?",
    answer:
      "Yes. When the parent allows it, the giver can receive optional monthly reading updates.",
  },
  {
    question: "When does the gift begin?",
    answer:
      "The gift begins after purchase and the parent or guardian receives the activation email.",
  },
];

const giftSteps = [
  {
    number: "1",
    image: "/images/gift-step-purchase.png",
    title: "Purchase the Gift",
    text: "Enter the parent or guardian’s email and tell us your relationship to the child.",
  },
  {
    number: "2",
    image: "/images/gift-step-parent.png",
    title: "Parent Activates It",
    text: "We email the parent or guardian instructions to activate the child’s membership.",
  },
  {
    number: "3",
    image: "/images/gift-step-adventure.png",
    title: "Share the Adventure",
    text: "The child receives access to stories, learning adventures, coins and rewards.",
  },
];

const giftBenefits = [
  {
    image: "/images/gift-benefit-meaningful.png",
    title: "A Meaningful Gift",
  },
  {
    image: "/images/gift-benefit-months.png",
    title: "3 Months Included",
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
    title: "Optional Updates",
  },
];

export default function GiftReadingPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [progressEmails, setProgressEmails] = useState(true);
  const [familyConfirmed, setFamilyConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const resumeStarted = useRef(false);

  async function openGiftCheckout(gift: PendingGift) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Please sign in before purchasing the gift.");
    }

    const response = await fetch("/api/create-gift-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        purchaserEmail: user.email || "",
        parentEmail: gift.parentEmail,
        relationship: gift.relationship,
        progressEmails: gift.progressEmails,
        familyConfirmed: gift.familyConfirmed,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.error || "Could not start gift checkout.");
    }

    sessionStorage.removeItem(PENDING_GIFT_KEY);
    window.location.href = data.url;
  }

  useEffect(() => {
    async function resumeGiftCheckout() {
      const params = new URLSearchParams(window.location.search);
      const shouldResumeGift = params.get("resumeGift") === "1";

      if (!shouldResumeGift || resumeStarted.current) {
        return;
      }

      const savedGift = sessionStorage.getItem(PENDING_GIFT_KEY);

      if (!savedGift) {
        return;
      }

      try {
        const gift: PendingGift = JSON.parse(savedGift);

        resumeStarted.current = true;

        setParentEmail(gift.parentEmail);
        setRelationship(gift.relationship);
        setProgressEmails(gift.progressEmails);
        setFamilyConfirmed(gift.familyConfirmed);
        setLoading(true);

        await openGiftCheckout(gift);
      } catch (error) {
        console.error("Gift checkout error:", error);

        alert(
          error instanceof Error
            ? error.message
            : "Could not start gift checkout."
        );

        resumeStarted.current = false;
        setLoading(false);
      }
    }

    resumeGiftCheckout();
  }, []);

  async function startGiftCheckout() {
    if (!parentEmail.trim()) {
      alert("Please enter the parent or guardian’s email.");
      return;
    }

    if (!relationship) {
      alert("Please choose your relationship to the child.");
      return;
    }

    if (!familyConfirmed) {
      alert("Please check the Pinkie Promise first.");
      return;
    }

    const pendingGift: PendingGift = {
      parentEmail: parentEmail.trim().toLowerCase(),
      relationship,
      progressEmails,
      familyConfirmed: true,
    };

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        sessionStorage.setItem(
          PENDING_GIFT_KEY,
          JSON.stringify(pendingGift)
        );

        const returnPath = `${window.location.pathname}?resumeGift=1`;

        window.location.href = `/signup?next=${encodeURIComponent(
          returnPath
        )}`;

        return;
      }

      await openGiftCheckout(pendingGift);
    } catch (error) {
      console.error("Gift checkout error:", error);

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
      .getElementById("gift-checkout")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="giftPage">
      <Header />

      <main className="giftMain">
        <section className="giftHero">
          <div className="giftHeroCopy">
            <p className="giftEyebrow">FAMILY GIFT MEMBERSHIP</p>

            <h1>
              Gift
              <span>Reading!</span>
            </h1>

            <p className="giftDescription">
              A special family gift for grandparents, aunts, uncles and family
              members who want to support a child’s reading adventure.
            </p>

            <div className="giftPrice">
              <strong>$19.99</strong>
              <span>3 months included, then $4.99/month</span>
            </div>

            <div className="giftQuickBenefits">
              <div>
                <img src="/images/gift-starts-now.png" alt="" />
                <span>Starts Right Away</span>
              </div>

              <div>
                <img src="/images/gift-parent-activates.png" alt="" />
                <span>Parent Activates</span>
              </div>

              <div>
                <img src="/images/gift-updates.png" alt="" />
                <span>Optional Updates</span>
              </div>

              <div>
                <img src="/images/benefit-safe.png" alt="" />
                <span>Safe for Kids</span>
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
              ★ A family gift that begins right away—no trial required.
            </p>
          </div>

          <aside className="giftFaqPanel">
            <p className="giftFaqTitle">
              Questions? We’ve Got Answers.
            </p>

            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="giftFaqItem" key={item.question}>
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

        <section className="giftLowerPanel">
          <div className="giftInformation">
            <div className="giftSectionHeading">
              <span />
              <h2>How It Works</h2>
              <span />
            </div>

            <div className="giftSteps">
              {giftSteps.map((step) => (
                <article className="giftStep" key={step.number}>
                  <span className="giftStepNumber">{step.number}</span>

                  <img src={step.image} alt="" />

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="giftSectionHeading giftBenefitsHeading">
              <span />
              <h2>Why Families Love Gift Reading</h2>
              <span />
            </div>

            <div className="giftBenefitGrid">
              {giftBenefits.map((benefit) => (
                <article className="giftBenefit" key={benefit.title}>
                  <img src={benefit.image} alt="" />
                  <h3>{benefit.title}</h3>
                </article>
              ))}
            </div>
          </div>

          <aside className="giftCheckout" id="gift-checkout">
            <p className="giftCheckoutEyebrow">GIFT READING</p>
            <h2>Support a Child’s Reading Adventure</h2>

            <label htmlFor="parentEmail">
              Parent or Guardian’s Email
            </label>

            <input
              id="parentEmail"
              type="email"
              placeholder="parent@email.com"
              value={parentEmail}
              onChange={(event) =>
                setParentEmail(event.target.value)
              }
              autoComplete="email"
            />

            <p className="giftFieldNote">
              We’ll email the parent or guardian instructions to activate the
              child’s membership.
            </p>

            <label htmlFor="relationship">
              Your relationship to the child
            </label>

            <select
              id="relationship"
              value={relationship}
              onChange={(event) =>
                setRelationship(event.target.value)
              }
            >
              <option value="">Choose relationship</option>
              <option value="grandparent">Grandparent</option>
              <option value="aunt_uncle">Aunt or Uncle</option>
              <option value="family_member">Other Family Member</option>
            </select>

            <label className="giftProgressOption">
              <input
                type="checkbox"
                checked={progressEmails}
                onChange={(event) =>
                  setProgressEmails(event.target.checked)
                }
              />

              <span>
                Email me monthly reading updates with completed books, coins,
                rewards and reading streaks.
              </span>
            </label>

            <div className="giftChargeBox">
              <span>Today’s Charge</span>
              <strong>$19.99</strong>
            </div>

            <div className="giftPinkieBox">
              <img
                src="/images/luke-pinkie-swear.png"
                alt="Luke holding out his pinkie"
              />

              <div>
                <h3>Pinkie Promise</h3>

                <p>
                  Please confirm this gift is from a grandparent, aunt, uncle
                  or another family member.
                </p>

                <label>
                  <input
                    type="checkbox"
                    checked={familyConfirmed}
                    onChange={(event) =>
                      setFamilyConfirmed(event.target.checked)
                    }
                  />

                  <span>
                    I pinkie promise I am a family member.
                  </span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={startGiftCheckout}
              className="giftCheckoutButton"
              disabled={
                !parentEmail.trim() ||
                !relationship ||
                !familyConfirmed ||
                loading
              }
            >
              {loading
                ? "Opening Secure Checkout..."
                : "Gift Read With Luke"}
            </button>

            <p className="giftCheckoutFinePrint">
              🔒 By continuing, you confirm this gift is from a family member.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
