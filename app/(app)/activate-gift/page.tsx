"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./activate-gift.css";

type ActivationStage =
  | "loading"
  | "setup"
  | "report"
  | "complete"
  | "already-activated"
  | "error";

type GiftInfo = {
  guardianEmail: string;
  gifterName: string;
  relationship: string;
  progressReportRequested: boolean;
  alreadyActivated: boolean;
};

function EyeIcon({
  hidden,
}: {
  hidden: boolean;
}) {
  return hidden ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2 2 0 002.7 2.7" />
      <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9.5 5 9.5 5a15.6 15.6 0 01-3.1 3.8" />
      <path d="M6.6 6.6C4 8.3 2.5 11 2.5 11S6.5 16 12 16c1.2 0 2.3-.2 3.3-.6" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12S6.5 7 12 7s9.5 5 9.5 5-4 5-9.5 5-9.5-5-9.5-5z" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

export default function ActivateGiftPage() {
  const [token, setToken] =
    useState("");

  const [giftInfo, setGiftInfo] =
    useState<GiftInfo | null>(null);

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [stage, setStage] =
    useState<ActivationStage>(
      "loading"
    );

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  useEffect(() => {
    async function loadGift() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const giftToken =
        params.get("token") || "";

      setToken(giftToken);

      if (!giftToken) {
        setMessage(
          "This gift activation link is missing its token."
        );

        setStage("error");
        return;
      }

      try {
        const response = await fetch(
          `/api/activate-gift?token=${encodeURIComponent(
            giftToken
          )}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Could not load this gift."
          );
        }

        setGiftInfo({
          guardianEmail:
            data.guardianEmail,

          gifterName:
            data.gifterName,

          relationship:
            data.relationship,

          progressReportRequested:
            Boolean(
              data.progressReportRequested
            ),

          alreadyActivated:
            Boolean(
              data.alreadyActivated
            ),
        });

        if (
          data.alreadyActivated
        ) {
          setStage(
            "already-activated"
          );

          return;
        }

        setStage("setup");
      } catch (error) {
        console.error(
          "Gift lookup error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Could not load this gift."
        );

        setStage("error");
      }
    }

    loadGift();
  }, []);

  async function handleActivation(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setMessage(
        "This gift activation link is invalid."
      );
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Your passwords do not match."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/activate-gift",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 409 &&
        data.accountExists
      ) {
        setMessage(
          data.message ||
            "An account already exists for this email. Please sign in to activate your gift."
        );

        setStage(
          "already-activated"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not activate this gift."
        );
      }

      const guardianEmail =
        data.email ||
        giftInfo?.guardianEmail;

      if (!guardianEmail) {
        throw new Error(
          "The guardian email could not be found."
        );
      }

      const {
        error: signInError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              guardianEmail,

            password,
          }
        );

      if (signInError) {
        throw new Error(
          "Your gift was activated, but we could not sign you in automatically. Please use your new password on the login page."
        );
      }

      if (
        data.progressReportRequested
      ) {
        setGiftInfo(
          (current) =>
            current
              ? {
                  ...current,
                  gifterName:
                    data.gifterName ||
                    current.gifterName,
                }
              : current
        );

        setStage("report");
      } else {
        setStage("complete");
      }
    } catch (error) {
      console.error(
        "Gift activation error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not activate this gift. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReportChoice(
    approved: boolean
  ) {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Your login session could not be found."
        );
      }

      const response = await fetch(
        "/api/gift-report-consent",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            token,
            approved,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not save your choice."
        );
      }

      setStage("complete");
    } catch (error) {
      console.error(
        "Report consent error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save your choice."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="activateGiftPage">
        <section className="activateGiftCard">
          {stage === "loading" && (
            <div className="activateGiftLoading">
              Checking your gift...
            </div>
          )}

          {stage === "error" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                GIFT INVITATION
              </p>

              <h1>
                OH NO!
              </h1>

              <p className="activateGiftDescription">
                {message}
              </p>

              <Link
                href="/"
                className="activateGiftButton"
              >
                GO HOME
              </Link>
            </>
          )}

          {stage === "setup" &&
            giftInfo && (
              <>
                <div className="activateGiftIcon">
                  🎁
                </div>

                <p className="activateGiftEyebrow">
                  A SPECIAL GIFT
                </p>

                <h1>
                  YOUR READING
                  <br />
                  ADVENTURE
                  <br />
                  IS WAITING!
                </h1>

                <p className="activateGiftDescription">
                  <strong>
                    {giftInfo.gifterName}
                  </strong>{" "}
                  gifted your child
                  3 months of Read With
                  Luke!
                </p>

                <p className="activateGiftDescription">
                  Create your password
                  below to activate the
                  gift. No payment
                  information is required.
                </p>

                <form
                  className="activateGiftForm"
                  onSubmit={
                    handleActivation
                  }
                >
                  <label htmlFor="giftEmail">
                    Parent or Guardian
                    Email
                  </label>

                  <input
                    id="giftEmail"
                    type="email"
                    value={
                      giftInfo.guardianEmail
                    }
                    readOnly
                    aria-readonly="true"
                  />

                  <p className="activateGiftEmailNote">
                    This gift was sent
                    specifically to this
                    email address.
                  </p>

                  <label htmlFor="giftPassword">
                    Create Password
                  </label>

                  <div className="activateGiftPasswordField">
                    <input
                      id="giftPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Create a password"
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon
                        hidden={
                          showPassword
                        }
                      />
                    </button>
                  </div>

                  <label htmlFor="giftConfirmPassword">
                    Confirm Password
                  </label>

                  <div className="activateGiftPasswordField">
                    <input
                      id="giftConfirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon
                        hidden={
                          showConfirmPassword
                        }
                      />
                    </button>
                  </div>

                  {passwordsMatch && (
                    <p className="activateGiftPasswordMatch activateGiftPasswordSuccess">
                      ✓ Passwords match
                    </p>
                  )}

                  {passwordsDoNotMatch && (
                    <p className="activateGiftPasswordMatch activateGiftPasswordError">
                      ✕ Passwords do not
                      match
                    </p>
                  )}

                  {message && (
                    <p className="activateGiftMessage">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="activateGiftButton"
                    disabled={
                      loading ||
                      password.length <
                        6 ||
                      password !==
                        confirmPassword
                    }
                  >
                    {loading
                      ? "ACTIVATING..."
                      : "CREATE ACCOUNT & ACTIVATE"}
                  </button>
                </form>

                <p className="activateGiftNoPayment">
                  🔒 You will not be asked
                  for a credit card. The
                  gift has already been
                  purchased for you.
                </p>
              </>
            )}

          {stage === "report" &&
            giftInfo && (
              <>
                <div className="activateGiftIcon">
                  💌
                </div>

                <p className="activateGiftEyebrow">
                  ONE MORE THING
                </p>

                <h1>
                  SHARE THE
                  <br />
                  ADVENTURE?
                </h1>

                <p className="activateGiftDescription">
                  <strong>
                    {giftInfo.gifterName}
                  </strong>{" "}
                  requested a monthly
                  Read With Luke report
                  card.
                </p>

                <p className="activateGiftDescription">
                  With your permission,
                  we&apos;ll email them a
                  monthly summary of your
                  child&apos;s reading and
                  learning progress.
                </p>

                <div className="activateGiftPrivacyBox">
                  <strong>
                    You&apos;re in control.
                  </strong>

                  <p>
                    Nothing will be shared
                    unless you choose Yes.
                    You can change this
                    later.
                  </p>
                </div>

                {message && (
                  <p className="activateGiftMessage">
                    {message}
                  </p>
                )}

                <button
                  type="button"
                  className="activateGiftButton"
                  onClick={() =>
                    handleReportChoice(
                      true
                    )
                  }
                  disabled={loading}
                >
                  {loading
                    ? "SAVING..."
                    : "YES, SHARE MONTHLY REPORT CARDS"}
                </button>

                <button
                  type="button"
                  className="activateGiftSecondaryButton"
                  onClick={() =>
                    handleReportChoice(
                      false
                    )
                  }
                  disabled={loading}
                >
                  NO THANKS
                </button>
              </>
            )}

          {stage === "complete" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                GIFT ACTIVATED
              </p>

              <h1>
                LET&apos;S START
                <br />
                READING!
              </h1>

              <p className="activateGiftDescription">
                Your Read With Luke
                account is ready and your
                3-month gift is active.
              </p>

              <Link
                href="/library"
                className="activateGiftButton"
              >
                GO TO THE LIBRARY
              </Link>
            </>
          )}

          {stage ===
            "already-activated" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                YOUR GIFT
              </p>

              <h1>
                ALREADY
                <br />
                ACTIVATED!
              </h1>

              <p className="activateGiftDescription">
                {message ||
                  "This gift is connected to an existing Read With Luke account."}
              </p>

              <Link
                href="/login"
                className="activateGiftButton"
              >
                SIGN IN
              </Link>

              <Link
                href="/forgot-password"
                className="activateGiftForgot"
              >
                Forgot your password?
              </Link>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
