import type { Metadata } from "next";
import { cookies } from "next/headers";
import PartnerPassClient from "./PartnerPassClient";
import "./partner-pass.css";

export const metadata: Metadata = {
  title: "30-Day Partner Adventure Pass",
  description:
    "Private 30-day Read With Luke partner access for invited affiliates and creators.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default async function PartnerPassPage() {
  const cookieStore = await cookies();

  const isUnlocked =
    cookieStore.get("rwl-partner-pass")?.value === "allowed";

  return <PartnerPassClient initiallyUnlocked={isUnlocked} />;
}
