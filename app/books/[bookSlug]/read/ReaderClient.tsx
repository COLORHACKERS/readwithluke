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
    if (pageNumber > 1) router.push(`/books/${bookSlug}/read?page=${pageNumber - 1}`);
  }

  function goNext() {
    if (pageNumber < totalPages) router.push(`/books/${bookSlug}/read?page=${pageNumber + 1}`);
  }

  return (
    <main className="readerPage">
      <section className="readerImageSide">
        <img src={imageUrl} alt={`${title} page ${pageNumber}`} />
      </section>

      <aside className="readerPanel">
        <div className="readerTopBar">
          <Link href="/" className="readerMiniBtn">HOME</Link>
          <Link href="/library" className="readerMiniBtn">LIBRARY</Link>

          <div className="readerTopIcons">
            <button><img src="/images/heart.png" alt="Favorite" /></button>
            <button><img src="/images/bookmark.png" alt="Save" /></button>
            <button><img src="/images/share.png" alt="Share" /></button>
          </div>
        </div>

        <div className="readerProgressRow">
          <span>Page {pageNumber} of {totalPages}</span>
          <div className="readerProgress">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="readerStoryText">
          <h1>{title.toUpperCase()}</h1>
          <p>{text || "This page is waiting for an adventure..."}</p>
        </div>

        <div className="readerControls">
          <button
            onClick={goBack}
            className={pageNumber === 1 ? "disabledCircle" : ""}
          >
            <img src="/images/icon-arrow-left.png" alt="" />
          </button>

          <button className="readerReadAloud">READ ALOUD</button>

          <button
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