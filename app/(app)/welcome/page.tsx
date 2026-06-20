"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./welcome.css";

export default function WelcomePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [childFirstName, setChildFirstName] = useState("");
  const [childAge, setChildAge] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        child_first_name: childFirstName,
        child_age: childAge,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/membership");
  }

  return (
    <main className="welcomePage">
      <form className="welcomeCard" onSubmit={handleSave}>
        <h1>Welcome!</h1>
        <p>Tell us who is reading with Luke.</p>

        <input
          placeholder="Parent first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          placeholder="Parent last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          placeholder="Child first name"
          value={childFirstName}
          onChange={(e) => setChildFirstName(e.target.value)}
        />

        <input
          placeholder="Child age"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
        />

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}