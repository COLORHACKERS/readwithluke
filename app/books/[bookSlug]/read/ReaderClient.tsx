"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import LikeButton from "@/app/components/LikeButton";
import { supabase } from "@/lib/supabase";

type Props = {
  bookId: string;
  bookSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl: string;
  text: string;
};

export default function ReaderClient({
  bookId,
  bookSlug,
  title,
  pageNumber,
  totalPages,
  imageUrl,
  text,
}: Props) {
  const router = useRouter();
  const progress = Math.max(4, Math.min((pageNumber / totalPages) * 100, 100));
  const isLastPage = pageNumber === totalPages;

  async function finishBook() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup");
      return;
    }

    const { error } = await supabase.from("reading_history").upsert(
      {
        user_id: user.id,
        book_id: bookId,
        coins_earned: 1,
      },
      {
        onConflict: "user_id,book_id",
      }
    );

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  async function shareBook() {
    const shareUrl = `${window.location.origin}/books/${bookSlug}/read?page=${pageNumber}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Read "${title}" with me on Read With Luke!`,
          url: shareUrl,
        });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  }

  function goBack() {
    if (pageNumber > 1) {
      router.push(`/books/${bookSlug}/read?page=${pageNumber - 1}`);
    }
  }

  function goNext() {
    if (pageNumber < totalPages) {
      router.push(`/books/${bookSlug}/read?page=${pageNumber + 1}`);
    }
  }

  return (
    <main className="readerPage">
      <section className="readerImageSide">
        <img src={imageUrl} alt={`${title} page ${pageNumber}`} />
      </section>

      <aside className="readerPanel">
        <div className="readerDesktopTopBar">
          <Link href="/" className="readerMiniBtn">
            HOME
          </Link>

          <Link href="/library" className="readerMiniBtn">
            LIBRARY
          </Link>

         <div className="readerTopActions">
  <LikeButton bookId={bookId} />

  <button type="button" aria-label="Bookmark">
    <img src="/images/bookmark.png" alt="" />
  </button>

  <button type="button" onClick={shareBook} aria-label="Share">
    <img src="/images/share.png" alt="" />
  </button>
</div>
        </div>

        <div className="readerHeaderRow">
          <div className="readerProgressRow">
            <span>
              Page {pageNumber} of {totalPages}
            </span>

            <div className="readerProgress">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          <details className="readerMenu">
            <summary>☰</summary>

            <div className="readerMenuPanel">
              <Link href="/">Home</Link>
              <Link href="/library">Library</Link>

              <div className="readerMenuLike">
                <LikeButton bookId={bookId} />
              </div>

              <button type="button">
                <img src="/images/bookmark.png" alt="" />
                Save
              </button>

              <button type="button" onClick={shareBook}>
                <img src="/images/share.png" alt="" />
                Share
              </button>
            </div>
          </details>
        </div>

        <div className="readerStoryText">
          <h1>{title.toUpperCase()}</h1>
          <p>{text || "This page is waiting for an adventure..."}</p>
          <div className="readerScrollHint">⌄</div>
        </div>

        <div className="readerControls">
          <button
            type="button"
            onClick={goBack}
            className={pageNumber === 1 ? "disabledCircle" : ""}
          >
            <img src="/images/icon-arrow-left.png" alt="" />
          </button>

          {isLastPage ? (
            <button
              type="button"
              className="readerFinishButton"
              onClick={finishBook}
            >
              FINISH +1 🪙
            </button>
          ) : (
            <button type="button" className="readerReadAloud">
              READ ALOUD
            </button>
          )}

          <button
            type="button"
            onClick={goNext}
            className={isLastPage ? "disabledCircle" : ""}
          >
            <img src="/images/icon-arrow-right.png" alt="" />
          </button>
        </div>
      </aside>
    </main>
  );
}
