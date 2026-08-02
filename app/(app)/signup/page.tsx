"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./signup.css";

type ReaderPlan = "monthly" | "yearly";

const GIFT_RETURN_PATH = "/gift?resumeGift=1";
const OLD_GIFT_RETURN_PATH = "/membership?resumeGift=1";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isGiftSignup, setIsGiftSignup] = useState(false);

 const [selectedPlan, setSelectedPlan] = useState<
  "monthly" | "yearly" | "partner30"
>("monthly");

useEffect(() => {
  const params = new URLSearchParams(
    window.location.search
  );

  const next = params.get("next");
  const plan = params.get("plan");
  const emailFromUrl = params.get("email");

  const giftSignup =
    next === GIFT_RETURN_PATH ||
    next === OLD_GIFT_RETURN_PATH;

  setIsGiftSignup(giftSignup);

  if (plan === "yearly") {
    setSelectedPlan("yearly");
  } else if (plan === "partner30") {
    setSelectedPlan("partner30");
  } else {
    setSelectedPlan("monthly");
  }

  if (emailFromUrl) {
    setEmail(emailFromUrl);
  }
}, []);
  async function handleSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email
        .trim()
        .toLowerCase();

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        alert("Unable to create your account.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const next = params.get("next");

      const isReturningToGift =
        next === GIFT_RETURN_PATH ||
        next === OLD_GIFT_RETURN_PATH;

      /*
       * GIFT SIGNUP
       *
       * Return to the gift page after creating
       * the purchaser account.
       */
      if (isReturningToGift) {
        window.location.href = GIFT_RETURN_PATH;
        return;
      }

      /*
       * READER MEMBERSHIP SIGNUP
       *
       * Send the selected monthly or yearly plan
       * to the Stripe checkout API.
       */
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
  userId: user.id,
  email: cleanEmail,
  plan: selectedPlan,
}),
        }
      );

      const checkout = await response.json();

      if (!response.ok || !checkout.url) {
        alert(
          checkout.error ||
            "Unable to start checkout."
        );

        setLoading(false);
        return;
      }

      window.location.href = checkout.url;
    } catch (error) {
      console.error("Signup error:", error);

      alert(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  const isYearlyPlan =
    selectedPlan === "yearly";

  return (
    <>
      <Header />

      <main className="signupPage">
        <form
          className="signupCard"
          onSubmit={handleSignup}
        >
         <h1>
  {isGiftSignup
    ? "Create Your Gift Account!"
    : isYearlyPlan
      ? "Start Your Yearly Membership!"
      : "Start Your 7-Day Free Trial!"}
</h1>

         {isGiftSignup ? (
  <p>
    Create your account to continue to the{" "}
    <strong>$19.99 family gift checkout.</strong>
    <br />
    You will return to your completed gift form after signup.
  </p>
) : isYearlyPlan ? (
  <p>
    Create your account to start your yearly membership.
    <br />
    You will be charged{" "}
    <strong>$69.99 today</strong> for one full year of access.
    <br />
    Your membership will renew automatically for{" "}
    <strong>$69.99 per year</strong> unless canceled.
  </p>
) : (
  <p>
    Create your account to begin your{" "}
    <strong>7-day free trial.</strong>
    <br />
    Your payment method will be securely saved today, but{" "}
    <strong>you won&apos;t be charged during your trial.</strong>
    <br />
    Unless you cancel before your trial ends, your membership will
    automatically continue for <strong>$9.99 per month.</strong>
  </p>
)}
          {!isGiftSignup && (
            <div className="signupSelectedPlan">
              <span>SELECTED PLAN</span>

              <strong>
                {isYearlyPlan
                  ? "YEARLY — $69.99/YEAR"
                  : "MONTHLY — $9.99/MONTH"}
              </strong>
            </div>
          )}

          <input
            type="email"
            placeholder="Parent email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength={6}
            required
          />

      <button type="submit" disabled={loading}>
  {loading
    ? isGiftSignup
      ? "CREATING ACCOUNT..."
      : isYearlyPlan
        ? "OPENING YEARLY CHECKOUT..."
        : "STARTING TRIAL..."
    : isGiftSignup
      ? "CONTINUE TO GIFT CHECKOUT"
      : isYearlyPlan
        ? "CONTINUE — $69.99/YEAR"
        : "START 7-DAY FREE TRIAL"}
</button>
        </form>
      </main>

      <Footer />
    </>
  );
}
