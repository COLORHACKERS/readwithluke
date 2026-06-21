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
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

if (!user) {
  if (localStorage.getItem("rwl-admin") === "yes") {
    setAllowed(true);
    return;
  }

  router.replace("/signup");
  return;
}

setAllowed(true);
    }

    checkUser();
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