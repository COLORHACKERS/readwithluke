"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

type ReaderGateProps = {
  children: React.ReactNode;
};

type ProfileAccess = {
  membership_status: string | null;
  complimentary_access: boolean | null;
};

type FreeLearnItem = {
  is_free: boolean | null;
  is_published: boolean | null;
};

export default function ReaderGate({
  children,
}: ReaderGateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function allowAccess() {
      if (cancelled) return;

      setAllowed(true);
      setChecking(false);
    }

    function denyAccess() {
      if (!cancelled) {
        setAllowed(false);
        setChecking(false);
      }

      router.replace("/membership");
    }

    async function checkAccess() {
      try {
        const pathParts = pathname
          .split("/")
          .filter(Boolean);

        /*
         * Learn routes:
         * /learn/the-moon-s-secret-powers-part-2
         * /learn/the-moon-s-secret-powers-part-2/read
         */
        const isLearnItemRoute =
          pathParts[0] === "learn" &&
          Boolean(pathParts[1]);

        if (isLearnItemRoute) {
          const learnSlug = pathParts[1];

          const {
            data: learnItem,
            error: learnItemError,
          } = await supabase
            .from("learn_items")
            .select("is_free, is_published")
            .eq("slug", learnSlug)
            .maybeSingle<FreeLearnItem>();

          if (learnItemError) {
            console.error(
              "ReaderGate free Learn item error:",
              learnItemError
            );
          }

          const isFreePublishedItem =
            learnItem?.is_free === true &&
            learnItem?.is_published === true;

          if (isFreePublishedItem) {
            allowAccess();
            return;
          }
        }

        /*
         * All other protected content requires
         * a valid membership.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          denyAccess();
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            "membership_status, complimentary_access"
          )
          .eq("id", user.id)
          .maybeSingle<ProfileAccess>();

        if (profileError || !profile) {
          console.error(
            "ReaderGate profile error:",
            profileError
          );

          denyAccess();
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

        if (
          !hasPaidAccess &&
          !hasComplimentaryAccess
        ) {
          denyAccess();
          return;
        }

        allowAccess();
      } catch (error) {
        console.error(
          "ReaderGate access error:",
          error
        );

        denyAccess();
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="readerLoading">
        <p>Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
