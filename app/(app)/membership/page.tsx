"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./membership.css";

export default function MembershipPage() {
  async function startCheckout() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/signup";
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Could not start checkout.");
        return;
      }

      if (!data.url) {
        alert("Stripe did not return a checkout URL.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout Exception:", error);
      alert("Could not start checkout. Please try again.");
    }
  }

  return (
    <>
      <Header />

      <main className="membershipPage">
        <section className="membershipCard">
          <p className="membershipEyebrow">READ WITH LUKE MEMBERSHIP</p>

          <h1>
            READ FREE
            <br />
            UNTIL LAUNCH.
          </h1>

          <p className="membershipDescription">
            Create your membership today and unlock unlimited access to every
            story, learning adventure, reward, and future feature.
          </p>

          <p className="membershipDescription">
            No charge today. Your card will be charged
            <strong> $12.99/month </strong>
            when our official launch countdown ends unless you cancel before
            then.
          </p>

          <div className="membershipPrice">
            <strong>$12.99</strong>
            <span>per month after launch</span>
          </div>

          <button
            type="button"
            onClick={startCheckout}
            className="membershipButton"
          >
            START FREE MEMBERSHIP
          </button>

          <p className="membershipFinePrint">
            Free until launch. Cancel anytime before billing starts.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}