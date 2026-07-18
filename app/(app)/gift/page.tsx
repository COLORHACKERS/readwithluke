"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./gift.css";

type PendingGift = {
  parentEmail: string;
  relationship: string;
  progressEmails: boolean;
  familyConfirmed: boolean;
};

const PENDING_GIFT_KEY = "rwl-pending-gift";

export default function MembershipPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [progressEmails, setProgressEmails] = useState(true);
  const [familyConfirmed, setFamilyConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

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
      alert("Please enter the parent’s email.");
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

  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipCard giftCard">
          <p className="membershipEyebrow">
            FAMILY GIFT MEMBERSHIP
          </p>

          <h1>
            GIFT
            <br />
            READING!
          </h1>

          <p className="membershipDescription">
            A special family gift for grandparents, aunts, uncles, and family
            members who want to support a child’s reading adventure!
          </p>

          <div className="membershipPrice">
            <strong>$19.99</strong>
            <span>for 3 months of access, then $4.99/month</span>
          </div>

          <div className="giftDetails">
            <div className="giftField">
              <label
                className="giftFieldLabel"
                htmlFor="parentEmail"
              >
                Parent or Guardian’s Email
              </label>

              <input
                id="parentEmail"
                className="giftTextInput"
                type="email"
                placeholder="parent@email.com"
                value={parentEmail}
                onChange={(event) =>
                  setParentEmail(event.target.value)
                }
                autoComplete="email"
                required
              />

              <p className="giftFieldNote">
                We’ll email the parent or guardian instructions to activate
                the child’s Read With Luke membership.
              </p>
            </div>

            <div className="giftField">
              <label
                className="giftFieldLabel"
                htmlFor="relationship"
              >
                Your relationship to the child
              </label>

              <select
                id="relationship"
                className="giftSelect"
                value={relationship}
                onChange={(event) =>
                  setRelationship(event.target.value)
                }
                required
              >
                <option value="">Choose relationship</option>
                <option value="grandparent">Grandparent</option>
                <option value="aunt_uncle">Aunt or Uncle</option>
                <option value="family_member">
                  Other Family Member
                </option>
              </select>
            </div>

            <label className="progressEmailOption">
              <input
                type="checkbox"
                checked={progressEmails}
                onChange={(event) =>
                  setProgressEmails(event.target.checked)
                }
              />

              <span>
                Email me a monthly reading update with books completed,
                coins, badges, and reading streak.
              </span>
            </label>
          </div>

          <div className="pinkieSwearBox">
            <img
              src="/images/luke-pinkie-swear.png"
              alt="Luke holding out his pinkie"
            />

            <h2>Pinkie Promise</h2>

            <p>
              Before gifting Read With Luke, please pinkie promise this
              special gift is from a grandparent, aunt, uncle, or another
              family member.
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

          <button
            type="button"
            onClick={startGiftCheckout}
            className="membershipButton"
            disabled={
              !parentEmail.trim() ||
              !relationship ||
              !familyConfirmed ||
              loading
            }
          >
            {loading
              ? "STARTING GIFT..."
              : "GIFT READ WITH LUKE"}
          </button>

          <p className="membershipFinePrint">
            By continuing, you confirm this gift is from a family member.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
