"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./membership.css";

export default function MembershipPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [progressEmails, setProgressEmails] = useState(true);
  const [familyConfirmed, setFamilyConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/signup";
        return;
      }

      const response = await fetch("/api/create-gift-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          purchaserEmail: user.email,
          parentEmail: parentEmail.trim().toLowerCase(),
          relationship,
          progressEmails,
          familyConfirmed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        alert(data.error || "Could not start gift checkout.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Gift checkout error:", error);
      alert("Could not start gift checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipCard giftCard">
          <p className="membershipEyebrow">FAMILY GIFT MEMBERSHIP</p>

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
            <label htmlFor="parentEmail">Parent’s Email</label>

            <input
              id="parentEmail"
              type="email"
              placeholder="parent@email.com"
              value={parentEmail}
              onChange={(event) => setParentEmail(event.target.value)}
              required
            />

            <p className="giftFieldNote">
              This parent account will receive the child’s Read With Luke
              access.
            </p>

            <label htmlFor="relationship">Who are you?</label>

            <select
              id="relationship"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              required
            >
              <option value="">Choose relationship</option>
              <option value="grandparent">Grandparent</option>
              <option value="aunt_uncle">Aunt or Uncle</option>
              <option value="family_member">Other Family Member</option>
            </select>

            <label className="progressEmailOption">
              <input
                type="checkbox"
                checked={progressEmails}
                onChange={(event) =>
                  setProgressEmails(event.target.checked)
                }
              />

              <span>
                Email me a monthly progress report with books completed, coins,
                badges, and reading streak.
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
              Before gifting Read With Luke, please pinkie promise this special
              gift is from a grandparent, aunt, uncle, or another family member.
            </p>

            <label>
              <input
                type="checkbox"
                checked={familyConfirmed}
                onChange={(event) =>
                  setFamilyConfirmed(event.target.checked)
                }
              />

              <span>I pinkie promise I am a family member.</span>
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
            {loading ? "STARTING GIFT..." : "GIFT READ WITH LUKE"}
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
