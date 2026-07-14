"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ReaderGateProps = {
  children: React.ReactNode;
};

type ProfileAccess = {
  membership_status: string | null;
  complimentary_access: boolean | null;
};

export default function ReaderGate({ children }: ReaderGateProps) {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ReaderGateProps = {
  children: React.ReactNode;
};

type ProfileAccess = {
  membership_status: string | null;
  complimentary_access: boolean | null;
};

export default function ReaderGate({ children }: ReaderGateProps) {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function denyAccess(destination: string) {
      if (!cancelled) {
        setAllowed(false);
        setChecking(false);
      }

      router.replace(destination);
    }

    async function checkAccess() {
      try {
        /*
         * No admin/localStorage bypass.
         * Every visitor must have a real Supabase user.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("ReaderGate user error:", userError);
          await denyAccess("/signup");
          return;
        }

        if (!user) {
          await denyAccess("/signup");
          return;
        }

        /*
         * Only load the profile belonging to the signed-in user.
         */
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("membership_status, complimentary_access")
          .eq("id", user.id)
          .maybeSingle<ProfileAccess>();

        if (profileError) {
          console.error("ReaderGate profile error:", profileError);
          await denyAccess("/membership");
          return;
        }

        if (!profile) {
          console.error("ReaderGate: no profile found for user", user.id);
          await denyAccess("/membership");
          return;
        }

        const membershipStatus = String(
          profile.membership_status ?? ""
        )
          .trim()
          .toLowerCase();

        const hasPaidAccess =
          membershipStatus === "active" ||
          membershipStatus === "trialing";

        const hasComplimentaryAccess =
          profile.complimentary_access === true;

        const canAccess =
          hasPaidAccess || hasComplimentaryAccess;

        if (!canAccess) {
          await denyAccess("/membership");
          return;
        }

        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
      } catch (error) {
        console.error("ReaderGate unexpected error:", error);
        await denyAccess("/membership");
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="readerLoading">
        <p>Checking membership...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

    async function checkAccess() {
      try {
        /*
         * Password-only admin access.
         * This must match the value created by your AdminGate.
         */
        const isAdmin =
          typeof window !== "undefined" &&
          localStorage.getItem("rwl-admin") === "yes";

        if (isAdmin) {
          if (!cancelled) {
            setAllowed(true);
            setChecking(false);
          }

          return;
        }

        /*
         * Normal customer access.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }

          router.replace("/signup");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("membership_status, complimentary_access")
          .eq("id", user.id)
          .single<ProfileAccess>();

        if (profileError || !profile) {
          console.error(
            "ReaderGate could not load this user's profile:",
            profileError
          );

          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }

          router.replace("/membership");
          return;
        }

        const membershipStatus = String(
          profile.membership_status ?? ""
        )
          .trim()
          .toLowerCase();

        const hasPaidAccess =
          membershipStatus === "active" ||
          membershipStatus === "trialing";

        const hasComplimentaryAccess =
          profile.complimentary_access === true;

        const canAccessReader =
          hasPaidAccess || hasComplimentaryAccess;

        if (!canAccessReader) {
          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }

          router.replace("/membership");
          return;
        }

        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
      } catch (error) {
        console.error("ReaderGate access error:", error);

        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }

        router.replace("/membership");
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="readerLoading">
        <p>Loading your book...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
