"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  learnSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl: string;
  text: string;
};

export default function ReaderClient({
  learnSlug,
  title,
  pageNumber,
  totalPages,
  imageUrl,
  text,
}: Props) {
  const router = useRouter();
  const progress = Math.max(4, Math.min((pageNumber / totalPages) * 100, 100));

  async function shareLearn() {
    const shareUrl = `${window.location.origin}/learn/${learnSlug}/read?page=${pageNumber}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Learn "${title}" with me on Read With Luke!`,
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
      router.push(`/learn/${learnSlug}/read?page=${pageNumber - 1}`);
    }
  }

  function goNext() {
    if (pageNumber < totalPages) {
      router.push(`/learn/${learnSlug}/read?page=${pageNumber + 1}`);
    }
  }

  return (
    <main className="readerPage">
      <section className="readerImageSide">
        <img src={imageUrl} alt={`${title} page ${pageNumber}`} />
      </section>

      <aside className="readerPanel">
        <div className="readerDesktopTopBar">
          <details className="readerMenu readerMenuAlways">
            <summary>MENU</summary>

            <div className="readerMenuPanel">
              <Link href="/">Home</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/library">Library</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </details>

          <div />

          <div className="readerTopActions">
            <button type="button" aria-label="Favorite">
              <img src="/images/heart.png" alt="" />
            </button>

            <button type="button" aria-label="Bookmark">
              <img src="/images/bookmark.png" alt="" />
            </button>

            <button type="button" onClick={shareLearn} aria-label="Share">
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

         <Link href="/" className="readerMiniBtn">
  HOME
</Link>

<Link href="/learn" className="readerMiniBtn">
  BACK TO LEARN
</Link>

              <button type="button">
                <img src="/images/heart.png" alt="" />
                Favorite
              </button>

              <button type="button">
                <img src="/images/bookmark.png" alt="" />
                Save
              </button>

              <button type="button" onClick={shareLearn}>
                <img src="/images/share.png" alt="" />
                Share
              </button>
            </div>
          </details>
        </div>

        <div className="readerStoryText">
          <h1>{title.toUpperCase()}</h1>
          <p>{text || "This learning page is waiting for something awesome..."}</p>
        </div>

        <div className="readerControls">
          <button
            type="button"
            onClick={goBack}
            className={pageNumber === 1 ? "disabledCircle" : ""}
          >
            <img src="/images/icon-arrow-left.png" alt="" />
          </button>

          <button type="button" className="readerReadAloud">
            READ ALOUD
          </button>

          <button
            type="button"
            onClick={goNext}
            className={pageNumber === totalPages ? "disabledCircle" : ""}
          >
            <img src="/images/icon-arrow-right.png" alt="" />
          </button>
        </div>
      </aside>
    </main>
  );
}
