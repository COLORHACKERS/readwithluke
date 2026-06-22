"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./header.css";


export default function Header() {
  const pathname = usePathname();
  const [initials, setInitials] = useState<string | null>(null);

 function active(path: string) {
  if (path === "/library") {
    return (
      pathname === "/library" ||
      pathname.startsWith("/books/")
    );
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

const last =
  profile?.last_name?.trim()?.[0] ||
  "";

setInitials(`${first}${last}`.toUpperCase() || "A");
    }

    loadUser();
  }, []);

  return (
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

<Link className={active("/learn-to-read") ? "active" : ""} href="/learn-to-read">
  Learn to Read
</Link>
      </nav>

      <div className="headerRight">
       {initials ? (
  <>
    <Link
      href="/dashboard"
      className={`headerStreak ${active("/dashboard") ? "active" : ""}`}
    >
      <span className="headerFlame">🔥</span>
    </Link>

    <Link
      href="/profile"
      className={`headerAvatar ${active("/profile") ? "active" : ""}`}
    >
      {initials}
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
      </div>
    </header>
  );
}