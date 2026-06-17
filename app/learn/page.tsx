import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import "./learn.css";

export default async function LearnPage() {
  const { data: items } = await supabase
    .from("learn_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="learnPage">
        <h1>Learn With Luke</h1>

        <div className="learnGrid">
          {items?.map((item) => (
            <Link
              key={item.id}
              href={`/learn/${item.slug}`}
              className="learnCard"
            >
              <img src={item.cover_url || item.image_url} alt={item.title} />
              <h2>{item.title}</h2>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}