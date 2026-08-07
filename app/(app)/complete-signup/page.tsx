"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CompleteSignupContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(
    "Finishing your account..."
  );

  useEffect(() => {
    async function finishSignup() {
      try {
        const sessionId =
          searchParams.get("session_id");

        const email =
          sessionStorage.getItem(
            "rwl-pending-email"
          );

        const password =
          sessionStorage.getItem(
            "rwl-pending-password"
          );

        const plan =
          sessionStorage.getItem(
            "rwl-pending-plan"
          ) || "monthly";

        if (!sessionId) {
          throw new Error(
            "Missing Stripe checkout session."
          );
        }

        if (!email || !password) {
          throw new Error(
            "Your signup information could not be found. Please start again."
          );
        }

        const response = await fetch(
          "/api/complete-signup",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId,
              email,
              password,
              plan,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to finish your account."
          );
        }

        sessionStorage.removeItem(
          "rwl-pending-email"
        );

        sessionStorage.removeItem(
          "rwl-pending-password"
        );

        sessionStorage.removeItem(
          "rwl-pending-plan"
        );

        setStatus(
          "Your account is ready! Redirecting..."
        );

        window.location.href =
          "/login?signup=success";
      } catch (error) {
        console.error(
          "Complete signup error:",
          error
        );

        setStatus(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      }
    }

    finishSignup();
  }, [searchParams]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "42px",
          borderRadius: "28px",
          background: "#F8F1E6",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: "0 0 16px",
            color: "#13294B",
          }}
        >
          Welcome to Read With Luke!
        </h1>

        <p>{status}</p>
      </div>
    </main>
  );
}

export default function CompleteSignupPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#ffffff",
            display: "grid",
            placeItems: "center",
          }}
        >
          <p>Finishing your account...</p>
        </main>
      }
    >
      <CompleteSignupContent />
    </Suspense>
  );
}
