import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReaderClient from "./ReaderClient";
import LearnGate from "./LearnGate";
import "@/app/books/[bookSlug]/read/reader.css";

type Props = {
  params: Promise<{ learnSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function LearnReadPage({ params, searchParams }: Props) {
  const { learnSlug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page || "1");

  const { data: item } = await supabase
    .from("learn_items")
    .select("*")
    .eq("slug", learnSlug)
    .maybeSingle();

  if (!item) {
    return (
      <main className="readerPage">
        <div className="readerEmpty">
          <h1>Learning item not found.</h1>
          <Link href="/learn">Back to Learn</Link>
        </div>
      </main>
    );
  }

  const { data: pages } = await supabase
    .from("learn_pages")
    .select("*")
    .eq("learn_item_id", item.id)
    .order("page_number", { ascending: true });

  if (!pages || pages.length === 0) {
    return (
      <main className="readerPage">
        <div className="readerEmpty">
          <h1>No learning pages uploaded yet.</h1>
          <Link href="/admin/learn">Go to Learn Admin</Link>
        </div>
      </main>
    );
  }

  const pageData =
    pages.find((p) => p.page_number === currentPage) || pages[0];

  const imageUrl =
    pageData.image_url ||
    item.cover_url ||
    item.image_url ||
    "/images/6to5ratio.png";

return (
  <LearnGate>
    <ReaderClient
      learnSlug={item.slug}
      title={item.title}
      pageNumber={pageData.page_number}
      totalPages={pages.length}
      imageUrl={imageUrl}
      text={pageData.text || ""}
    />
  </LearnGate>
);
}
