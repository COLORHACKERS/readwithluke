import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import "../learn.css";

export default async function LearnViewer({
  params,
}: {
  params: Promise<{ learnSlug: string }>;
}) {
  const { learnSlug } = await params;

  const { data: item } = await supabase
    .from("learn_items")
    .select("*")
    .eq("slug", learnSlug)
    .maybeSingle();

  if (!item) {
    return (
      <>
        <Header />
        <main className="learnViewer">
          <Link href="/learn" className="learnClose">
            ×
          </Link>
          <h1>Learn item not found.</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="learnViewer">
        <Link href="/learn" className="learnClose">
          ×
        </Link>

        <img
          src={item.image_url || ""}
          alt={item.title}
          className="learnFullImage"
        />
      </main>
    </>
  );
}