"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "../signup/signup.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <Header />

      <main className="signupPage">
        <form className="signupCard" onSubmit={handleLogin}>
          <h1>LOG IN</h1>

          <p>Welcome back! Continue your reading adventure.</p>

          <input
            placeholder="Parent email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOG IN</button>

          <p className="authSmallText">
            Don&apos;t have an account?{" "}
            <Link href="/signup">Join here</Link>
          </p>
        </form>
      </main>

      <Footer />
    </>
  );
}