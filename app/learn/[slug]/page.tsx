import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./learn-detail.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LearnDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: item } = await supabase
    .from("learn_items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!item) {
    return (
      <main className="learnBoardPage emptyLearn">
        <h1>Learning activity not found.</h1>
        <Link href="/learn">BACK TO LEARN</Link>
      </main>
    );
  }

  const boardImage =
    item.image_url || item.cover_url || "/images/6to5ratio.png";

  return (
    <main className="learnBoardPage">
      <img src={boardImage} alt={item.title} className="learnBoardImage" />

<div className="learnBoardControls">
  <Link href="/learn" className="learnBackButton">
    <img src="/images/icon-arrow-left.png" alt="" />
    BACK
  </Link>

  <button>
    <img src="/images/heart.png" alt="Favorite" />
  </button>

  <button>
    <img src="/images/bookmark.png" alt="Save" />
  </button>

  <button>
    <img src="/images/share.png" alt="Share" />
  </button>

  <Link href="/learn" className="learnCloseButton">
  ✕
</Link>
</div>
    </main>
  );
}