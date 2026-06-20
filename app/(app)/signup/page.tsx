"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./signup.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Next we will connect membership billing.");
  }

  return (
    <main className="signupPage">
      <form className="signupCard" onSubmit={handleSignup}>
        <h1>Create Account</h1>
        <p>Start your free membership. Billing begins after launch.</p>

        <input
          placeholder="Parent email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}