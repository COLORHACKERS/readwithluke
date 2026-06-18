import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{ learnSlug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LearnDetailPage({ params }: Props) {
  const { learnSlug } = await params;

  const { data: item } = await supabase
    .from("learn_items")
    .select("*")
    .eq("slug", learnSlug)
    .eq("is_published", true)
    .single();

  if (!item) {
    return (
      <>
        <Header />
        <main
          style={{
            minHeight: "calc(100vh - 86px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F8F1E6",
          }}
        >
          <h1>Learning activity not found.</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main
        style={{
          height: "calc(100vh - 86px)",
          background: "#F8F1E6",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Link
          href="/learn"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 20,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#ffffff",
            color: "#13294B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontSize: "28px",
            fontWeight: 900,
            boxShadow: "0 10px 30px rgba(0,0,0,.12)",
          }}
        >
          ✕
        </Link>

        <img
          src={item.image_url}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </main>
    </>
  );
}