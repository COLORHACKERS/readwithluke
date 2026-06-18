import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import "../../library/library.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LearnItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url: string | null;
  category: string | null;
  is_published: boolean;
};

export default async function LearnPage() {
  const { data: items } = await supabase
    .from("learn_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="libraryPage">
        <section className="libraryHero">
          <p>LEARN WITH LUKE</p>
          <h1>Pick something fun to learn.</h1>
        </section>

        <section className="bookGrid">
          {(items || []).map((item: LearnItem) => (
            <Link href={`/learn/${item.slug}`} className="bookCard" key={item.id}>
              <div className="bookImage">
                <img
                  src={item.cover_url || item.image_url || "/images/6to5ratio.png"}
                  alt={item.title}
                />
                <span className="newBadge">NEW</span>
              </div>

              <div className="bookInfo">
                <div className="bookMeta">
                  <span>{item.category || "Learning"}</span>
                </div>

                <h2>{item.title}</h2>

                <p>{item.description}</p>

                <strong>Start Learning →</strong>
              </div>
            </Link>
          ))}
        </section>

        {(!items || items.length === 0) && (
          <div className="emptyLibrary">
            <h2>No published learn items yet.</h2>
            <p>Go to the admin page and publish your first Learn With Luke image.</p>
            <Link href="/admin/learn">Open Learn Admin</Link>
          </div>
        )}
      </main>
    </>
  );
}