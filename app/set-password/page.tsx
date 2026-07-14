"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setHasSession(Boolean(session));
      setChecking(false);
    }

    checkSession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();

    router.replace("/login");
  }

  if (checking) {
    return (
      <main className="setPasswordPage">
        <div className="setPasswordCard">
          <p>Checking your invitation...</p>
        </div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="setPasswordPage">
        <div className="setPasswordCard">
          <h1>Invitation Required</h1>

          <p>
            Open the invitation email from Read With Luke and click the
            invitation link first.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="setPasswordPage">
      <form className="setPasswordCard" onSubmit={handleSubmit}>
        <h1>Create Your Password</h1>

        <p>
          Create the password you will use to log in to Read With Luke.
        </p>

        <label>
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create Password"}
        </button>

        {message && <p className="setPasswordMessage">{message}</p>}
      </form>
    </main>
  );
}
