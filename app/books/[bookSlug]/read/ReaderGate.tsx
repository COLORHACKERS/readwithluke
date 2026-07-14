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
    let cancelled = false;

    async function checkAccess() {
      try {
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
          .maybeSingle<ProfileAccess>();

        if (profileError || !profile) {
          console.error("ReaderGate profile error:", profileError);

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

        if (!hasPaidAccess && !hasComplimentaryAccess) {
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
        <p>Checking membership...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
