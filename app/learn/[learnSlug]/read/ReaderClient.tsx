"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  learnSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  lessonPageCount: number;
  hasWorksheets: boolean;
  imageUrl: string;
  text: string;
};

export default function ReaderClient({
  learnSlug,
  title,
  pageNumber,
  totalPages,
  lessonPageCount,
  hasWorksheets,
  imageUrl,
  text,
}: Props) {
  const router = useRouter();

  const progress = Math.max(
    4,
    Math.min((pageNumber / totalPages) * 100, 100)
  );

  /*
   * Each Learn story gets its own list of visited pages.
   *
   * Example:
   * rwl-learn-progress-how-does-a-rainbow-form
   */
  const progressKey = `rwl-learn-progress-${learnSlug}`;

  /* =========================================================
     RECORD EACH PAGE THE CHILD VISITS
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    /*
     * Only count actual learning pages.
     * The worksheet page itself does not count.
     */
    if (
      pageNumber < 1 ||
      pageNumber > lessonPageCount
    ) {
      return;
    }

    try {
      const saved = localStorage.getItem(progressKey);

      const visitedPages: number[] =
        saved ? JSON.parse(saved) : [];

      if (!visitedPages.includes(pageNumber)) {
        const updatedPages = [
          ...visitedPages,
          pageNumber,
        ].sort((a, b) => a - b);

        localStorage.setItem(
          progressKey,
          JSON.stringify(updatedPages)
        );
      }
    } catch (error) {
      console.error(
        "Could not save Learn page progress:",
        error
      );
    }
  }, [
    pageNumber,
    lessonPageCount,
    progressKey,
  ]);

  /* =========================================================
     CHECK IF EVERY LEARNING PAGE WAS VISITED
  ========================================================= */

  function hasCompletedLesson() {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const saved = localStorage.getItem(progressKey);

      const visitedPages: number[] =
        saved ? JSON.parse(saved) : [];

      /*
       * Include the current page too, just in case
       * the child clicks NEXT immediately after it loads.
       */
      const visitedIncludingCurrent = Array.from(
        new Set([
          ...visitedPages,
          pageNumber,
        ])
      );

      for (
        let page = 1;
        page <= lessonPageCount;
        page++
      ) {
        if (!visitedIncludingCurrent.includes(page)) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /* =========================================================
     SHARE
  ========================================================= */

  async function shareLearn() {
    const shareUrl =
      `${window.location.origin}` +
      `/learn/${learnSlug}/read` +
      `?page=${pageNumber}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Learn "${title}" with me on Read With Luke!`,
          url: shareUrl,
        });

        return;
      } catch {
        // User closed share sheet.
      }
    }

    await navigator.clipboard.writeText(
      shareUrl
    );

    alert("Link copied!");
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function goBack() {
    if (pageNumber > 1) {
      router.push(
        `/learn/${learnSlug}/read?page=${
          pageNumber - 1
        }`
      );
    }
  }

  function goNext() {
    /*
     * If this is the final actual learning page
     * and worksheets exist, go to the worksheet page.
     */
    if (
      hasWorksheets &&
      pageNumber === lessonPageCount
    ) {
      const completed =
        hasCompletedLesson();

      if (completed) {
        router.push(
          `/learn/${learnSlug}/read?worksheets=1&complete=1`
        );
      } else {
        router.push(
          `/learn/${learnSlug}/read?worksheets=1`
        );
      }

      return;
    }

    if (pageNumber < lessonPageCount) {
      router.push(
        `/learn/${learnSlug}/read?page=${
          pageNumber + 1
        }`
      );
    }
  }

  return (
    <main className="readerPage">
      <div className="readerImage">
        <img
          src={imageUrl}
          alt={`${title} page ${pageNumber}`}
        />
      </div>

      <aside className="readerPanel">
        <div className="readerDesktopTopBar">
          <Link
            href="/"
            className="readerMiniBtn"
          >
            HOME
          </Link>

          <Link
            href="/learn"
            className="readerMiniBtn"
          >
            BACK TO LEARN
          </Link>

          <div className="readerTopActions">
            <button
              type="button"
              aria-label="Favorite"
            >
              <img
                src="/images/heart.png"
                alt=""
              />
            </button>

            <button
              type="button"
              aria-label="Bookmark"
            >
              <img
                src="/images/bookmark.png"
                alt=""
              />
            </button>

            <button
              type="button"
              onClick={shareLearn}
              aria-label="Share"
            >
              <img
                src="/images/share.png"
                alt=""
              />
            </button>
          </div>
        </div>

        <div className="readerHeaderRow">
          <div className="readerProgressRow">
            <span>
              Page {pageNumber} of{" "}
              {totalPages}
            </span>

            <div className="readerProgress">
              <i
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="readerStoryText">
          <h1>
            {title.toUpperCase()}
          </h1>

          <p>
            {text ||
              "This learning page is waiting for something awesome..."}
          </p>
        </div>

        <div className="readerControls">
          <button
            type="button"
            onClick={goBack}
            className={
              pageNumber === 1
                ? "disabledCircle"
                : ""
            }
          >
            <img
              src="/images/icon-arrow-left.png"
              alt=""
            />
          </button>

          <button
            type="button"
            className="readerReadAloud"
          >
            READ ALOUD
          </button>

          <button
            type="button"
            onClick={goNext}
            className={
              !hasWorksheets &&
              pageNumber === lessonPageCount
                ? "disabledCircle"
                : ""
            }
          >
            <img
              src="/images/icon-arrow-right.png"
              alt=""
            />
          </button>
        </div>
      </aside>
    </main>
  );
}
