"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CompleteSignupPage() {
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!sessionId) {
      setMessage("Missing Stripe session.");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/complete-signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to finish your account."
        );
      }

      window.location.href = "/login?signup=success";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "42px",
          borderRadius: "28px",
          background: "#F8F1E6",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: "0 0 16px",
            color: "#13294B",
          }}
        >
          Create Your Password
        </h1>

        <p>
          Your Stripe checkout is complete.
          Create your Read With Luke password
          to finish setting up your account.
        </p>

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          minLength={6}
          required
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "18px",
            padding: "16px",
            border: 0,
            borderRadius: "999px",
            background: "#FF5526",
            color: "#ffffff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {loading
            ? "CREATING ACCOUNT..."
            : "FINISH ACCOUNT"}
        </button>

        {message && (
          <p style={{ marginTop: "18px" }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
