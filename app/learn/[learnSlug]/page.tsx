import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShareButton from "@/app/components/ShareButton";
import { supabase } from "@/lib/supabase";
import "@/app/books/[bookSlug]/bookPreview.css";

type Props = {
  params: Promise<{ learnSlug: string }>;
};

export default async function LearnPreviewPage({ params }: Props) {
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
        <main className="bookPreviewPage bookPreviewEmpty">
          <h1>Learning item not found.</h1>
          <Link href="/learn" className="previewOutlineButton">
            BACK TO LEARN
          </Link>
        </main>
        <Footer />
      </>
    );
  }
  const { count } = await supabase
    .from("learn_pages")
    .select("*", { count: "exact", head: true })
    .eq("learn_item_id", item.id);

 const heroImage =
  item.image_url ||
  item.cover_url;

  return (
    <>
      <Header />

      <main className="bookPreviewPage">
        <img src={heroImage} alt="" className="bookPreviewBg" />
        <div className="bookPreviewShade" />

        <section className="previewContent">
          <div className="previewProgressText">
            Progress: Page 1 of {count || 1}
          </div>

          <div className="previewProgressBar">
            <span />
          </div>

          <h1>{item.title}</h1>

          <p className="previewDescription">
            {item.description ||
              "Discover something awesome with Learn With Luke."}
          </p>

          <div className="previewButtons">
            <Link
              href={`/learn/${item.slug}/read?page=1`}
              className="previewStartButton"
            >
              START LEARNING
            </Link>

            <Link href="/learn" className="previewOutlineButton">
              BACK TO LEARN
            </Link>
          </div>

          <div className="readerTopIcons">
            <button type="button">
              <img src="/images/heart.png" alt="Favorite" />
            </button>

            <button type="button">
              <img src="/images/bookmark.png" alt="Save" />
            </button>

            <ShareButton
              title={item.title}
              text={
                item.description ||
                "Learn something awesome with me on Read With Luke!"
              }
              url={`/learn/${item.slug}`}
            />
          </div>
        </section>

        <div className="previewBottomTagline">
          LEARN. DISCOVER. EXPLORE.
        </div>
      </main>

      <Footer />
    </>
  );
}
