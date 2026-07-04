"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./signup.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
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

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email,
        }),
      });

      const checkout = await response.json();

      if (!response.ok) {
        alert(checkout.error || "Unable to start checkout.");
        setLoading(false);
        return;
      }

      window.location.href = checkout.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="signupPage">
        <form className="signupCard" onSubmit={handleSignup}>
          <h1>Start Your 7-Day Free Trial!</h1>

          <p>
            Create your account to begin your <strong>7-day free trial.</strong>
            <br />
            Your payment method will be securely saved today, but{" "}
            <strong>you won't be charged during your trial.</strong>
            <br />
            Unless you cancel before your trial ends, your membership will
            automatically continue for <strong>$9.99/month.</strong>
          </p>

          <input
            type="email"
            placeholder="Parent email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Starting Trial..." : "START FREE TRIAL"}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}