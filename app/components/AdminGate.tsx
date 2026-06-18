"use client";

import { useState } from "react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [allowed, setAllowed] = useState(false);

  function checkPassword() {
  if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAllowed(true);
      return;
    }

    alert("Wrong password");
  }

  if (!allowed) {
    return (
      <main className="adminPage">
        <section className="adminCard">
          <h1>Admin Login</h1>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={checkPassword}>
            Enter Admin
          </button>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}