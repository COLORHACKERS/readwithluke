"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./header.css";

export default function Header() {
  const pathname = usePathname();
  const [initials, setInitials] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  function active(path: string) {
    if (path === "/library") {
      return pathname === "/library" || pathname.startsWith("/books/");
    }

    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  }

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setInitials(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name,email")
        .eq("id", user.id)
        .single();

      const first =
        profile?.first_name?.trim()?.[0] ||
        user.email?.trim()?.[0] ||
        "";

      const last = profile?.last_name?.trim()?.[0] || "";

      setInitials(`${first}${last}`.toUpperCase() || "A");
    }

    loadUser();
  }, []);

  return (
    <>
      <header className="mainHeader">
        <Link href="/" className="headerLogo">
          <img src="/images/luke-intro.png" alt="Read With Luke" />
        </Link>

        <nav className="mainNav">
          <Link className={active("/library") ? "active" : ""} href="/library">
            Read With Luke
          </Link>

          <Link className={active("/learn") ? "active" : ""} href="/learn">
            Learn With Luke
          </Link>

          <Link
            className={active("/learn-to-read") ? "active" : ""}
            href="/learn-to-read"
          >
            Learn to Read
          </Link>
        </nav>

        <div className="headerRight">
          {initials ? (
            <>
<Link href="/dashboard" className="headerStatus">
  <span className="statusItem">🔥 0</span>
  <span className="statusItem">🪙 0</span>
  <span className="statusAvatar">{initials}</span>
</Link>
            </>
          ) : (
            <div className="headerAuth">
              <Link href="/login" className="headerLogin">
                LOGIN
              </Link>

              <Link href="/signup" className="headerSignup">
                JOIN
              </Link>
            </div>
          )}

          <button
            className="mobileMenuButton"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobileMenuOverlay" onClick={() => setMenuOpen(false)}>
          <nav
            className="mobileMenu"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="mobileMenuClose"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ×
            </button>

            <Link
              className={active("/library") ? "active" : ""}
              href="/library"
              onClick={() => setMenuOpen(false)}
            >
              Read With Luke
            </Link>

            <Link
              className={active("/learn") ? "active" : ""}
              href="/learn"
              onClick={() => setMenuOpen(false)}
            >
              Learn With Luke
            </Link>

            <Link
              className={active("/learn-to-read") ? "active" : ""}
              href="/learn-to-read"
              onClick={() => setMenuOpen(false)}
            >
              Learn to Read
            </Link>

            {initials ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  My Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
