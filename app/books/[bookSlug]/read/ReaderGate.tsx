"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReaderGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const isAdmin = localStorage.getItem("rwl-admin") === "yes";

      if (isAdmin) {
        setAllowed(true);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signup");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("membership_status, stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.replace("/membership");
        return;
      }

      const hasStripe =
        profile.stripe_customer_id || profile.stripe_subscription_id;

      const hasAccess =
        profile.membership_status === "trialing" ||
        profile.membership_status === "active";

      if (!hasStripe || !hasAccess) {
        router.replace("/membership");
        return;
      }

      setAllowed(true);
    }

    checkAccess();
  }, [router]);

  if (!allowed) {
    return (
      <div className="readerLoading">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
