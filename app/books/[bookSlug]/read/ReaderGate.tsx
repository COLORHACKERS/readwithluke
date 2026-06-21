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