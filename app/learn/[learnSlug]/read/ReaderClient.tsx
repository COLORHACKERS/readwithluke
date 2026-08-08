"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
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
  audioUrl: string;
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
  audioUrl,
}: Props) {
  const router = useRouter();

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [isAudioPlaying, setIsAudioPlaying] =
    useState(false);

  const progress = Math.max(
    4,
    Math.min(
      (pageNumber / totalPages) * 100,
      100
    )
  );

  const progressKey =
    `rwl-learn-progress-${learnSlug}`;

  /* =========================================================
     RESET AUDIO WHEN PAGE CHANGES
  ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    setIsAudioPlaying(false);
  }, [pageNumber, audioUrl]);

  /* =========================================================
     RECORD EACH LEARNING PAGE VISITED
  ========================================================= */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    // Do not count the worksheet page itself.
    if (
      pageNumber < 1 ||
      pageNumber > lessonPageCount
    ) {
      return;
    }

    try {
      const saved =
        localStorage.getItem(
          progressKey
        );

      const visitedPages: number[] =
        saved
          ? JSON.parse(saved)
          : [];

      if (
        !visitedPages.includes(
          pageNumber
        )
      ) {
        const updatedPages = [
          ...visitedPages,
          pageNumber,
        ].sort(
          (a, b) => a - b
        );

        localStorage.setItem(
          progressKey,
          JSON.stringify(
            updatedPages
          )
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
     CHECK LESSON COMPLETION
  ========================================================= */

  function hasCompletedLesson() {
    if (
      typeof window === "undefined"
    ) {
      return false;
    }

    try {
      const saved =
        localStorage.getItem(
          progressKey
        );

      const visitedPages: number[] =
        saved
          ? JSON.parse(saved)
          : [];

      const visitedIncludingCurrent =
        Array.from(
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
        if (
          !visitedIncludingCurrent.includes(
            page
          )
        ) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /* =========================================================
     READ ALOUD
  ========================================================= */

  async function toggleReadAloud() {
    const audio = audioRef.current;

    if (
      !audio ||
      !audioUrl
    ) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error(
        "Could not play Learn audio:",
        error
      );
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
          text:
            `Learn "${title}" with me on Read With Luke!`,
          url: shareUrl,
        });

        return;
      } catch {
        // User closed the share sheet.
      }
    }

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      alert("Link copied!");
    } catch {
      window.prompt(
        "Copy this link:",
        shareUrl
      );
    }
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
     * On the final learning page,
     * send the child to worksheets.
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

    if (
      pageNumber <
      lessonPageCount
    ) {
      router.push(
        `/learn/${learnSlug}/read?page=${
          pageNumber + 1
        }`
      );
    }
  }

  const disableNext =
    !hasWorksheets &&
    pageNumber === lessonPageCount;

  /* =========================================================
     READER
  ========================================================= */

  return (
    <main className="readerPage learnReaderPage">
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={
          audioUrl ||
          undefined
        }
        preload="metadata"
        onPlay={() =>
          setIsAudioPlaying(true)
        }
        onPause={() =>
          setIsAudioPlaying(false)
        }
        onEnded={() =>
          setIsAudioPlaying(false)
        }
      />

      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={`${title} page ${pageNumber}`}
      />

      {/* AUDIO WAVE */}
      {audioUrl && (
        <div
          className={`readerAudioWave learnAudioWave ${
            isAudioPlaying
              ? "readerAudioWavePlaying"
              : ""
          }`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      {/* READER PANEL */}
      <aside className="readerPanel">
        {/* TOP BAR */}
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

        {/* PROGRESS */}
        <div className="readerHeaderRow">
          <div className="readerProgressRow">
            <span>
              Page {pageNumber} of{" "}
              {totalPages}
            </span>

            <div className="readerProgress">
              <i
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* STORY */}
        <div className="readerStoryText">
          <h1>
            {title.toUpperCase()}
          </h1>

          <p>
            {text ||
              "This learning page is waiting for something awesome..."}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="readerControls">
          <button
            type="button"
            onClick={goBack}
            disabled={
              pageNumber === 1
            }
            className={
              pageNumber === 1
                ? "disabledCircle"
                : ""
            }
            aria-label="Previous page"
          >
            <img
              src="/images/icon-arrow-left.png"
              alt=""
            />
          </button>

          <button
            type="button"
            className={`readerReadAloud ${
              isAudioPlaying
                ? "readerReadAloudPlaying"
                : ""
            }`}
            onClick={
              toggleReadAloud
            }
            disabled={!audioUrl}
          >
            {isAudioPlaying
              ? "PAUSE"
              : "READ ALOUD"}
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={
              disableNext
            }
            className={
              disableNext
                ? "disabledCircle"
                : ""
            }
            aria-label="Next page"
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
