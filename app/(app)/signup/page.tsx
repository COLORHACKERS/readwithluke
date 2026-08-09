"use client";

import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./signup.css";

type ReaderPlan = "monthly" | "partner30";

const GIFT_RETURN_PATH = "/gift?resumeGift=1";

const OLD_GIFT_RETURN_PATH =
  "/membership?resumeGift=1";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [isGiftSignup, setIsGiftSignup] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<ReaderPlan>("monthly");

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

    if (plan === "partner30") {
      setSelectedPlan("partner30");
    } else {
      setSelectedPlan("monthly");
    }

    if (emailFromUrl) {
      setEmail(
        emailFromUrl.trim().toLowerCase()
      );
    }
  }, []);

  async function handleGiftSignup(
    cleanEmail: string
  ) {
    if (!password) {
      throw new Error(
        "Please create a password."
      );
    }

    if (password.length < 6) {
      throw new Error(
        "Your password must contain at least 6 characters."
      );
    }

    const {
      data: signupData,
      error: signupError,
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (signupError) {
      throw signupError;
    }

    if (!signupData.user) {
      throw new Error(
        "Your account could not be created. Please try again."
      );
    }

    window.location.href = GIFT_RETURN_PATH;
  }

  async function openStripeCheckout(
    cleanEmail: string
  ) {
    /*
     * Do not create the Supabase member here.
     * Stripe must successfully collect the card first.
     */
    const response = await fetch(
      "/api/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          plan: selectedPlan,
        }),
      }
    );

    const checkout = await response.json();

    if (!response.ok || !checkout.url) {
      throw new Error(
        checkout.error ||
          "Unable to open secure checkout."
      );
    }

    window.location.href = checkout.url;
  }

  async function handleSignup(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email
        .trim()
        .toLowerCase();

      if (!cleanEmail) {
        throw new Error(
          "Please enter the parent email."
        );
      }

      if (isGiftSignup) {
        await handleGiftSignup(cleanEmail);
        return;
      }

      await openStripeCheckout(cleanEmail);
    } catch (error) {
      console.error(
        "Signup or checkout error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  const isPartnerPlan =
    selectedPlan === "partner30";

  function getHeading() {
    if (isGiftSignup) {
      return "Create Your Gift Account!";
    }

    if (isPartnerPlan) {
      return "Start Your 30-Day Partner Pass!";
    }

    return "Start Your 7-Day Free Trial!";
  }

  function getSelectedPlanLabel() {
    if (isPartnerPlan) {
      return "PARTNER PASS — 30 DAYS FREE";
    }

    return "MONTHLY — 7 DAYS FREE, THEN $4.99/MONTH";
  }

  function getButtonText() {
    if (loading) {
      if (isGiftSignup) {
        return "CREATING ACCOUNT...";
      }

      return "OPENING SECURE CHECKOUT...";
    }

    if (isGiftSignup) {
      return "CONTINUE TO GIFT CHECKOUT";
    }

    if (isPartnerPlan) {
      return "START 30-DAY PARTNER PASS";
    }

    return "START 7-DAY FREE TRIAL";
  }

  return (
    <>
      <main className="signupPage">
        <form
          className="signupCard"
          onSubmit={handleSignup}
        >
          <h1>{getHeading()}</h1>

          {isGiftSignup ? (
            <p>
              Create your purchaser account to
              continue to the{" "}
              <strong>
                $19.99 family gift checkout.
              </strong>
              <br />
              You will return to your completed
              gift form after signup.
            </p>
          ) : isPartnerPlan ? (
            <p>
              Continue to Stripe to securely
              save your payment method for your{" "}
              <strong>
                private 30-day partner pass.
              </strong>
              <br />
              You will not be charged during
              the 30-day trial.
              <br />
              You will create your Read With
              Luke password after Stripe
              confirms your pass.
            </p>
          ) : (
            <p>
              Continue to Stripe to securely
              save your payment method for your{" "}
              <strong>
                7-day free trial.
              </strong>
              <br />
              You will not be charged during
              the trial. After the trial, your
              membership is{" "}
              <strong>$4.99/month</strong>.
              <br />
              You will create your Read With
              Luke password after Stripe
              confirms your trial.
            </p>
          )}

          {!isGiftSignup && (
            <div className="signupSelectedPlan">
              <span>SELECTED PLAN</span>

              <strong>
                {getSelectedPlanLabel()}
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

          {isGiftSignup && (
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {getButtonText()}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}
