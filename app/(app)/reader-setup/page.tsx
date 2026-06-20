"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../signup/signup.css";

export default function ReaderSetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("5-6");
  const [avatar, setAvatar] = useState("🐸");
  const [favoriteTheme, setFavoriteTheme] = useState("Adventure");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup");
      return;
    }

    const { error } = await supabase.from("children").insert({
      user_id: user.id,
      name,
      age_range: ageRange,
      avatar,
      favorite_theme: favoriteTheme,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="signupPage">
      <form className="signupCard" onSubmit={handleSave}>
        <h1>CREATE YOUR READER</h1>

        <p>Tell Luke who is joining the adventure.</p>

       <label>Reader name:</label>
<input
  placeholder="Reader name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>

<label>Age:</label>
<select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
  <option value="3-4">Age 3-4</option>
  <option value="5-6">Age 5-6</option>
  <option value="7-8">Age 7-8</option>
  <option value="9+">Age 9+</option>
</select>

<label>Pick an avatar:</label>
<select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
  <option value="🐸">🐸 Frog</option>
  <option value="🦊">🦊 Fox</option>
  <option value="🦖">🦖 Dinosaur</option>
  <option value="🚀">🚀 Rocket</option>
</select>

<label>Pick your favorite type of book:</label>
<select
  value={favoriteTheme}
  onChange={(e) => setFavoriteTheme(e.target.value)}
>
  <option value="Adventure">Adventure</option>
  <option value="Magic">Magic</option>
  <option value="Animals">Animals</option>
  <option value="Space">Space</option>
  <option value="Ocean">Ocean</option>
</select>

        <button type="submit">START READING</button>
      </form>
    </main>
  );
}