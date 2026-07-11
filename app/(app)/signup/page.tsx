"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./signup.css";

const GIFT_RETURN_PATH = "/membership?resumeGift=1";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGiftSignup, setIsGiftSignup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    setIsGiftSignup(next === GIFT_RETURN_PATH);
  }, []);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
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

      /*
       * GIFT FLOW:
       * Return to the membership page.
       * The membership page will restore the saved gift form
       * and start the $19.99 gift checkout.
       */
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      if (next === GIFT_RETURN_PATH) {
        window.location.href = GIFT_RETURN_PATH;
        return;
      }

      /*
       * NORMAL JOIN FLOW:
       * Start the regular 7-day free-trial checkout.
       */
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email: cleanEmail,
        }),
      });

      const checkout = await response.json();

      if (!response.ok || !checkout.url) {
        alert(checkout.error || "Unable to start checkout.");
        setLoading(false);
        return;
      }

      window.location.href = checkout.url;
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="signupPage">
        <form className="signupCard" onSubmit={handleSignup}>
          <h1>
            {isGiftSignup
              ? "Create Your Gift Account!"
              : "Start Your 7-Day Free Trial!"}
          </h1>

          {isGiftSignup ? (
            <p>
              Create your account to continue to the{" "}
              <strong>$19.99 family gift checkout.</strong>
              <br />
              You will return to your completed gift form after signup.
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
              automatically continue for <strong>$9.99/month.</strong>
            </p>
          )}

          <input
            type="email"
            placeholder="Parent email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? isGiftSignup
                ? "CREATING ACCOUNT..."
                : "STARTING TRIAL..."
              : isGiftSignup
                ? "CONTINUE TO GIFT CHECKOUT"
                : "START FREE TRIAL"}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}
