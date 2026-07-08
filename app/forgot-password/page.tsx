"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function resetPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <>
      <Header />

      <main className="forgotPage">
        <div className="forgotCard">
          <h1>Forgot Password?</h1>

          {sent ? (
            <>
              <p>
                We've emailed you a password reset link.
              </p>

              <Link href="/login">
                Back to Login
              </Link>
            </>
          ) : (
            <>
              <p>
                Enter the email you used when creating your Read With Luke account.
              </p>

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button onClick={resetPassword}>
                SEND RESET LINK
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
