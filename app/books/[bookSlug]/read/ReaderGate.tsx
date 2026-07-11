"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      try {
        // Allow admins to preview books.
        const isAdmin = localStorage.getItem("rwl-admin") === "yes";

        if (isAdmin) {
          if (isMounted) {
            setAllowed(true);
            setChecking(false);
          }

          return;
        }

        // Check whether the visitor is signed in.
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/signup");
          return;
        }

        // Get the reader's membership information.
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("membership_status, complimentary_access")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("ReaderGate profile error:", profileError);
          router.replace("/membership");
          return;
        }

        if (!profile) {
          console.error("ReaderGate: No profile found for user", user.id);
          router.replace("/membership");
          return;
        }

        const membershipStatus = profile.membership_status
          ?.trim()
          .toLowerCase();

        const hasPaidAccess =
          membershipStatus === "active" ||
          membershipStatus === "trialing";

        const hasComplimentaryAccess =
          profile.complimentary_access === true;

        if (!hasPaidAccess && !hasComplimentaryAccess) {
          router.replace("/membership");
          return;
        }

        if (isMounted) {
          setAllowed(true);
          setChecking(false);
        }
      } catch (error) {
        console.error("ReaderGate access error:", error);
        router.replace("/membership");
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checking || !allowed) {
    return (
      <div className="readerLoading">
        <p>Loading your book...</p>
      </div>
    );
  }

  return <>{children}</>;
}
