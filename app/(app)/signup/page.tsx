"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./signup.css";

type ReaderPlan =
  | "monthly"
  | "yearly"
  | "partner30";

const GIFT_RETURN_PATH = "/gift?resumeGift=1";
const OLD_GIFT_RETURN_PATH =
  "/membership?resumeGift=1";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

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

      if (!cleanEmail) {
        throw new Error(
          "Please enter your email."
        );
      }

      if (!password) {
        throw new Error(
          "Please enter a password."
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

      const newUser = signupData.user;

      if (!newUser) {
        throw new Error(
          "Your account could not be created. Please try again."
        );
      }

      if (isGiftSignup) {
        window.location.href =
          GIFT_RETURN_PATH;

        return;
      }

      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: newUser.id,
            email: cleanEmail,
            plan: selectedPlan,
          }),
        }
      );

      const checkout =
        await response.json();

      if (!response.ok || !checkout.url) {
        throw new Error(
          checkout.error ||
            "Unable to start checkout."
        );
      }

      window.location.href = checkout.url;
    } catch (error) {
      console.error(
        "Signup error:",
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

  const isYearlyPlan =
    selectedPlan === "yearly";

  const isPartnerPlan =
    selectedPlan === "partner30";

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
                : isPartnerPlan
                  ? "Start Your 30-Day Partner Pass!"
                  : "Start Your 7-Day Free Trial!"}
          </h1>

          {isGiftSignup ? (
            <p>
              Create your account to continue
              to the{" "}
              <strong>
                $19.99 family gift checkout.
              </strong>
              <br />
              You will return to your completed
              gift form after signup.
            </p>
          ) : isYearlyPlan ? (
            <p>
              Create your account to start your
              yearly membership.
              <br />
              You will be charged{" "}
              <strong>$69.99 today</strong> for
              one full year of access.
              <br />
              Your membership will renew
              automatically for{" "}
              <strong>
                $69.99 per year
              </strong>{" "}
              unless canceled.
            </p>
          ) : isPartnerPlan ? (
            <p>
              Create your account to begin your{" "}
              <strong>
                private 30-day partner pass.
              </strong>
              <br />
              Your payment method will be
              securely saved today, but{" "}
              <strong>
                you will not be charged during
                your 30-day trial.
              </strong>
              <br />
              Unless you cancel before the pass
              ends, your membership will
              automatically continue for{" "}
              <strong>
                $9.99 per month.
              </strong>
            </p>
          ) : (
            <p>
              Create your account to begin your{" "}
              <strong>
                7-day free trial.
              </strong>
              <br />
              Your payment method will be
              securely saved today, but{" "}
              <strong>
                you won&apos;t be charged during
                your trial.
              </strong>
              <br />
              Unless you cancel before your
              trial ends, your membership will
              automatically continue for{" "}
              <strong>
                $9.99 per month.
              </strong>
            </p>
          )}

          {!isGiftSignup && (
            <div className="signupSelectedPlan">
              <span>SELECTED PLAN</span>

              <strong>
                {isYearlyPlan
                  ? "YEARLY — $69.99/YEAR"
                  : isPartnerPlan
                    ? "PARTNER PASS — 30 DAYS FREE"
                    : "MONTHLY — 7 DAYS FREE"}
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

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? isGiftSignup
                ? "CREATING ACCOUNT..."
                : isYearlyPlan
                  ? "OPENING YEARLY CHECKOUT..."
                  : isPartnerPlan
                    ? "OPENING 30-DAY PASS..."
                    : "STARTING TRIAL..."
              : isGiftSignup
                ? "CONTINUE TO GIFT CHECKOUT"
                : isYearlyPlan
                  ? "CONTINUE — $69.99/YEAR"
                  : isPartnerPlan
                    ? "START 30-DAY PARTNER PASS"
                    : "START 7-DAY FREE TRIAL"}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}
