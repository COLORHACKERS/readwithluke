"use client";

import { useEffect, useState } from "react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("rwl-admin") === "yes") {
      setAllowed(true);
    }
  }, []);

  async function checkPassword() {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("rwl-admin", "yes");
      setAllowed(true);
      return;
    }

    alert("Wrong password");
  }

if (!allowed) {
  return (
    <main className="adminPage">
      <section className="adminLoginCard">
        <div className="adminLock">🔒</div>

        <h1>Admin Access</h1>

        <p>
          Enter your password to manage books and learning activities.
        </p>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") checkPassword();
          }}
        />

        <button
          className="adminLoginButton"
          onClick={checkPassword}
        >
          Enter Admin →
        </button>
      </section>
    </main>
  );
}

  return <>{children}</>;
}