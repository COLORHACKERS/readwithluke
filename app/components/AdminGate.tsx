"use client";

import { useEffect, useState } from "react";
import "@/app/admin/admin.css";

const ADMIN_PASSWORD = "lukeadmin123";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("rwl-admin") === "yes") {
      setAllowed(true);
    }
  }, []);

  function checkPassword() {
    if (password.trim() === ADMIN_PASSWORD) {
      localStorage.setItem("rwl-admin", "yes");
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
            onKeyDown={(e) => {
              if (e.key === "Enter") checkPassword();
            }}
          />

          <button onClick={checkPassword}>Enter Admin</button>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}