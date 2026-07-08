"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../forgot-password/forgot-password.css";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function updatePassword() {
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Your password has been updated!");

    router.push("/login");
  }

  return (
    <>
      <Header />

      <main className="forgotPage">
        <div className="forgotCard">
          <h1>Create New Password</h1>

          <p>
            Choose a new password for your Read With Luke account.
          </p>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={updatePassword}
            disabled={saving}
          >
            {saving ? "UPDATING..." : "SAVE NEW PASSWORD"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
