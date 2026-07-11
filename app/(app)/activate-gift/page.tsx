"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./activate-gift.css";

type Mode = "login" | "signup";

export default function ActivateGiftPage() {
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function initialize() {
      const params = new URLSearchParams(window.location.search);
      const giftToken = params.get("token") || "";

      setToken(giftToken);

      if (!giftToken) {
        setMessage("This gift activation link is missing its token.");
        setChecking(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await activateGift(giftToken, session.access_token);
      }

      setChecking(false);
    }

    initialize();
  }, []);

  async function activateGift(
    giftToken: string,
    accessToken: string
  ) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/activate-gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          token: giftToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not activate this gift.");
        setLoading(false);
        return;
      }

      setActivated(true);
      setMessage(data.message || "Your gift is active!");
    } catch (error) {
      console.error("Gift activation error:", error);
      setMessage("Could not activate this gift. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("This gift activation link is invalid.");
      return;
    }

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        if (!data.session) {
          setMessage(
            "Check your email to confirm your account. Then return to this gift link and sign in."
          );
          setLoading(false);
          return;
        }

        await activateGift(token, data.session.access_token);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.session) {
        setMessage(error?.message || "Could not sign in.");
        setLoading(false);
        return;
      }

      await activateGift(token, data.session.access_token);
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="activateGiftPage">
        <section className="activateGiftCard">
          {checking ? (
            <div className="activateGiftLoading">
              Checking your gift...
            </div>
          ) : activated ? (
            <>
              <div className="activateGiftIcon">🎁</div>

              <p className="activateGiftEyebrow">
                GIFT ACTIVATED
              </p>

              <h1>
                LET’S START
                <br />
                READING!
              </h1>

              <p className="activateGiftDescription">{message}</p>

              <Link href="/library" className="activateGiftButton">
                GO TO THE LIBRARY
              </Link>
            </>
          ) : (
            <>
              <div className="activateGiftIcon">🎁</div>

              <p className="activateGiftEyebrow">
                A FAMILY GIFT
              </p>

              <h1>
                ACTIVATE
                <br />
                YOUR GIFT!
              </h1>

              <p className="activateGiftDescription">
                Sign in with the parent or guardian email that received this
                invitation. No payment information is required.
              </p>

              <div className="activateGiftTabs">
                <button
                  type="button"
                  className={mode === "login" ? "active" : ""}
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  I HAVE AN ACCOUNT
                </button>

                <button
                  type="button"
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <form className="activateGiftForm" onSubmit={handleAuth}>
                <label htmlFor="giftEmail">
                  Parent or Guardian Email
                </label>

                <input
                  id="giftEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="parent@email.com"
                  autoComplete="email"
                  required
                />

                <label htmlFor="giftPassword">
                  {mode === "signup"
                    ? "Create Password"
                    : "Password"}
                </label>

                <input
                  id="giftPassword"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    mode === "signup"
                      ? "Create a password"
                      : "Enter your password"
                  }
                  minLength={6}
                  autoComplete={
                    mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                />

                {message && (
                  <p className="activateGiftMessage">{message}</p>
                )}

                <button
                  type="submit"
                  className="activateGiftButton"
                  disabled={loading || !token}
                >
                  {loading
                    ? "ACTIVATING..."
                    : mode === "signup"
                      ? "CREATE ACCOUNT & ACTIVATE"
                      : "SIGN IN & ACTIVATE"}
                </button>
              </form>

              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="activateGiftForgot"
                >
                  Forgot your password?
                </Link>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
