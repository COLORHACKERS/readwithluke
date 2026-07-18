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

export default function ReaderGate({
  children,
}: ReaderGateProps) {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function denyAccess() {
      if (!cancelled) {
        setAllowed(false);
        setChecking(false);
      }

      router.replace("/membership");
    }

    async function checkAccess() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        /*
         * Logged out visitors go to the membership
         * options page.
         */
        if (userError || !user) {
          await denyAccess();
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select(
              "membership_status, complimentary_access"
            )
            .eq("id", user.id)
            .maybeSingle<ProfileAccess>();

        /*
         * Logged-in user without a readable profile
         * goes to the membership options page.
         */
        if (profileError || !profile) {
          console.error(
            "ReaderGate profile error:",
            profileError
          );

          await denyAccess();
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

        /*
         * Logged-in user without active access
         * goes to the membership options page.
         */
        if (
          !hasPaidAccess &&
          !hasComplimentaryAccess
        ) {
          await denyAccess();
          return;
        }

        /*
         * Active, trialing, or complimentary users
         * may enter the reader.
         */
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
      } catch (error) {
        console.error(
          "ReaderGate access error:",
          error
        );

        await denyAccess();
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
