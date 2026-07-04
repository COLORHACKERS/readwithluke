"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");

  const [childId, setChildId] = useState("");
  const [readerName, setReaderName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [avatar, setAvatar] = useState("🐸");
  const [favoriteTheme, setFavoriteTheme] = useState("");

  const [storiesRead, setStoriesRead] = useState(0);
  const [learningRead, setLearningRead] = useState(0);
  const [streak, setStreak] = useState(0);

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setParentFirstName(profile.first_name || "");
        setParentLastName(profile.last_name || "");
      }

      const { data: child } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (child) {
        setChildId(child.id);
        setReaderName(child.name || "");
        setAgeRange(child.age_range || "");
        setAvatar(child.avatar || "🐸");
        setFavoriteTheme(child.favorite_theme || "");
      }

      const { data: history } = await supabase
        .from("reading_history")
        .select("completed_at, books(category)")
        .eq("user_id", user.id);

      if (history) {
        setStoriesRead(history.length);

        const learningCount = history.filter((item: any) => {
          const category = item.books?.category || "";
          return category.toLowerCase().includes("learn");
        }).length;

        setLearningRead(learningCount);

        const dates = Array.from(
          new Set(
            history.map((item: any) =>
              new Date(item.completed_at).toISOString().slice(0, 10)
            )
          )
        ).sort((a, b) => b.localeCompare(a));

        let currentStreak = 0;
        const today = new Date();

        for (let i = 0; i < dates.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const expected = checkDate.toISOString().slice(0, 10);

          if (dates.includes(expected)) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
      }
    }

    loadProfile();
  }, [router]);

  async function saveReaderInfo() {
    if (!childId) return;

    const { error } = await supabase
      .from("children")
      .update({
        name: readerName,
        age_range: ageRange,
        avatar,
        favorite_theme: favoriteTheme,
      })
      .eq("id", childId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Reader info saved!");
  }

  async function saveParentInfo() {
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: parentFirstName,
        last_name: parentLastName,
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Parent account saved!");
  }

  async function updatePassword() {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setNewPassword("");
    alert("Password updated!");
  }

  async function openBillingPortal() {
    if (!userId) return;

    const res = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not open billing.");
      return;
    }

    window.location.href = data.url;
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <Header />

      <main className="profilePage">
        <section className="profileHero">
          <img src="/images/home-hero.png" alt="" className="profileBg" />

          <div className="profileSettings">
            <div className="profileTop">
              <div className="profileAvatar">{avatar || "🐸"}</div>

              <div>
                <h1>
                  Welcome Back,{" "}
                  {parentFirstName || readerName || "Reader"}!
                </h1>
                <p>Manage reader info, password, membership, and billing.</p>
              </div>
            </div>

          <div className="readerStats">
  <div>
    <strong>{storiesRead}</strong>
    <span>Stories Read</span>
  </div>

  <div>
    <strong>{learningRead}</strong>
    <span>Learning Adventures</span>
  </div>

  <div>
    <strong>{streak}</strong>
    <span>Day Streak</span>
  </div>
</div>

            <div className="settingsGrid">
              <section className="settingsCard">
                <h2>Reader Info</h2>

                <label>Reader Name</label>
                <input
                  value={readerName}
                  onChange={(e) => setReaderName(e.target.value)}
                />

                <label>Age</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                >
                  <option value="">Choose age</option>
                  <option value="3-4">Age 3-4</option>
                  <option value="5-6">Age 5-6</option>
                  <option value="7-8">Age 7-8</option>
                  <option value="9+">Age 9+</option>
                </select>

                <label>Avatar</label>
                <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
                  <option value="🐸">🐸 Frog</option>
                  <option value="🦊">🦊 Fox</option>
                  <option value="🦖">🦖 Dinosaur</option>
                  <option value="🚀">🚀 Rocket</option>
                </select>

                <label>Favorite Book Type</label>
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

                <button onClick={saveReaderInfo}>Save Reader Info</button>
              </section>

              <section className="settingsCard">
                <h2>Parent Account</h2>

                <label>Parent First Name</label>
                <input
                  value={parentFirstName}
                  onChange={(e) => setParentFirstName(e.target.value)}
                />

                <label>Parent Last Name</label>
                <input
                  value={parentLastName}
                  onChange={(e) => setParentLastName(e.target.value)}
                />

                <label>Email</label>
                <input value={email} disabled />

                <button onClick={saveParentInfo}>Save Account</button>
              </section>

              <section className="settingsCard">
                <h2>Change Password</h2>

                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button onClick={updatePassword}>Update Password</button>
              </section>

              <section className="settingsCard">
                <h2>Membership & Billing</h2>

                <p className="planText">Current Plan: Free Trial</p>

                <button onClick={openBillingPortal}>Manage Billing</button>

                <button
                  className="secondaryButton"
                  onClick={() => router.push("/membership")}
                >
                  Upgrade Membership
                </button>

                <br />

                <button className="logoutButton" onClick={logout}>
                  Log Out
                </button>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
