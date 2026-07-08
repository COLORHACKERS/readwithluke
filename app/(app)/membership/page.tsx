"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./membership.css";

export default function MembershipPage() {
  const [familyConfirmed, setFamilyConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startGiftCheckout() {
    if (!familyConfirmed) {
      alert("Please pinkie swear you are a family member.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/signup";
      return;
    }

    const response = await fetch("/api/create-gift-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
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
  }

  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipGrid singleGiftGrid">
          <div className="membershipCard giftCard">
            <p className="membershipEyebrow">FAMILY GIFT MEMBERSHIP</p>

            <h1>
              GIFT
              <br />
              READING!
            </h1>

            <p className="membershipDescription">
              A special family gift for grandparents, aunts, uncles, and family
              members who want to support a child’s reading adventure.
            </p>

            <div className="membershipPrice">
              <strong>$19.99</strong>
              <span>for the first 3 months, then $4.99/month</span>
            </div>

            <div className="pinkieSwearBox">
              <img src="/images/luke-pinkie-swear.png" alt="Luke pinkie swear" />

              <label>
                <input
                  type="checkbox"
                  checked={familyConfirmed}
                  onChange={(e) => setFamilyConfirmed(e.target.checked)}
                />
                <span>
                  I pinkie swear I am a grandparent, aunt, uncle, or family
                  member.
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={startGiftCheckout}
              className="membershipButton"
              disabled={!familyConfirmed || loading}
            >
              {loading ? "STARTING GIFT..." : "GIFT READ WITH LUKE"}
            </button>

            <p className="membershipFinePrint">
              By continuing, you confirm this gift is from a family member.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
