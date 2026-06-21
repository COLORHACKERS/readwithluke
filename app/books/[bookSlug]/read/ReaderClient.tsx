"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  bookSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl: string;
  text: string;
};

export default function ReaderClient({
  bookSlug,
  title,
  pageNumber,
  totalPages,
  imageUrl,
  text,
}: Props) {
  const router = useRouter();

  const progress = Math.max(4, Math.min((pageNumber / totalPages) * 100, 100));

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
        <div className="readerMiniHeader">
          <Link href="/library" className="readerLogo">
            <img src="/images/luke-intro.png" alt="Read With Luke" />
          </Link>

          <Link href="/library" className="readerBackLibrary">
            BACK TO LIBRARY
          </Link>

          <button className="readerIconButton">
            <img src="/images/icon-heart.png" alt="Favorite" />
          </button>

          <button className="readerIconButton">
            <img src="/images/icon-bookmark.png" alt="Save" />
          </button>

          <button className="readerIconButton">
            <img src="/images/icon-share.png" alt="Share" />
          </button>
        </div>

        <div className="readerProgressRow">
          <span>
            Page {pageNumber} of {totalPages}
          </span>

          <div className="readerProgress">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="readerStoryText">
          <h1>{pageNumber === 1 ? title : title}</h1>

          <p>{text || "No text added for this page yet."}</p>
        </div>

        <div className="readerControls">
          <button
            onClick={goBack}
            className={pageNumber === 1 ? "disabledCircle" : ""}
            aria-label="Previous page"
          >
            <img src="/images/icon-arrow-left.png" alt="" />
          </button>

          <button className="readerReadAloud">
            READ ALOUD
          </button>

          <button
            onClick={goNext}
            className={pageNumber === totalPages ? "disabledCircle" : ""}
            aria-label="Next page"
          >
            <img src="/images/icon-arrow-right.png" alt="" />
          </button>
        </div>
      </aside>
    </main>
  );
}