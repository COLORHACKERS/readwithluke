"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LikeButton from "@/app/components/LikeButton";
import BookmarkButton from "@/app/components/BookmarkButton";

type Props = {
  bookId: string;
  bookSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl: string;
  text: string;
  audioUrl: string;
};

export default function ReaderClient({
  bookId,
  bookSlug,
  title,
  pageNumber,
  totalPages,
  imageUrl,
  text,
  audioUrl,
}: Props) {
  const router = useRouter();

  /* =========================================================
     REFS
  ========================================================= */

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const storyRef =
    useRef<HTMLDivElement | null>(null);

  /* =========================================================
     STATE
  ========================================================= */

  const [
    isAudioPlaying,
    setIsAudioPlaying,
  ] = useState(false);

  const [
    scrollThumb,
    setScrollThumb,
  ] = useState({
    top: 0,
    height: 100,
    visible: false,
  });

  /* =========================================================
     PAGE VALUES
  ========================================================= */

  const progress = Math.max(
    4,
    Math.min(
      (pageNumber / totalPages) * 100,
      100
    )
  );

  const isLastPage =
    pageNumber === totalPages;

  /* =========================================================
     CUSTOM STORY SCROLLBAR
  ========================================================= */

  function updateStoryScrollbar() {
    const story =
      storyRef.current;

    if (!story) {
      return;
    }

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = story;

    const maxScroll =
      scrollHeight -
      clientHeight;

    if (maxScroll <= 2) {
      setScrollThumb({
        top: 0,
        height: 100,
        visible: false,
      });

      return;
    }

    const thumbHeight =
      Math.max(
        18,
        (
          clientHeight /
          scrollHeight
        ) * 100
      );

    const availableTravel =
      100 - thumbHeight;

    const thumbTop =
      (
        scrollTop /
        maxScroll
      ) * availableTravel;

    setScrollThumb({
      top: thumbTop,
      height: thumbHeight,
      visible: true,
    });
  }

  /* =========================================================
     RESET STORY SCROLL ON PAGE CHANGE
  ========================================================= */

  useEffect(() => {
    const story =
      storyRef.current;

    if (story) {
      story.scrollTop = 0;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          updateStoryScrollbar();
        }
      );

    window.addEventListener(
      "resize",
      updateStoryScrollbar
    );

    return () => {
      window.cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "resize",
        updateStoryScrollbar
      );
    };
  }, [
    pageNumber,
    text,
  ]);

  /* =========================================================
     RESET AUDIO WHEN PAGE CHANGES
  ========================================================= */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    setIsAudioPlaying(false);
  }, [
    pageNumber,
    audioUrl,
  ]);

  /* =========================================================
     SAVE READING PROGRESS
  ========================================================= */

  useEffect(() => {
    void saveProgress();
  }, [pageNumber]);

  /* =========================================================
     GET ACTIVE CHILD
  ========================================================= */

  async function getActiveChildId(
    userId: string
  ) {
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "active_child_id"
      )
      .eq(
        "id",
        userId
      )
      .maybeSingle();

    if (profileError) {
      throw new Error(
        profileError.message
      );
    }

    if (
      profile?.active_child_id
    ) {
      return (
        profile.active_child_id
      );
    }

    /*
     * Fallback for older accounts
     * without active_child_id.
     */

    const {
      data: firstChild,
      error: childError,
    } = await supabase
      .from("children")
      .select("id")
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      )
      .limit(1)
      .maybeSingle();

    if (childError) {
      throw new Error(
        childError.message
      );
    }

    if (!firstChild) {
      return null;
    }

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        active_child_id:
          firstChild.id,
      })
      .eq(
        "id",
        userId
      );

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return firstChild.id;
  }

  /* =========================================================
     FINISH BOOK
  ========================================================= */

  async function finishBook() {
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      router.push(
        "/signup"
      );

      return;
    }

    try {
      const activeChildId =
        await getActiveChildId(
          user.id
        );

      if (!activeChildId) {
        alert(
          "Please create a reader profile before finishing this book."
        );

        router.push(
          "/reader-setup"
        );

        return;
      }

      const {
        error,
      } = await supabase
        .from(
          "reading_history"
        )
        .upsert(
          {
            user_id:
              user.id,

            child_id:
              activeChildId,

            book_id:
              bookId,

            coins_earned:
              1,

            completed_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              "child_id,book_id",
          }
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      router.push(
        "/dashboard"
      );
    } catch (error) {
      console.error(
        "Finish book error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not finish this book."
      );
    }
  }

  /* =========================================================
     SAVE PAGE PROGRESS
  ========================================================= */

  async function saveProgress() {
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    await supabase
      .from(
        "book_bookmarks"
      )
      .upsert(
        {
          user_id:
            user.id,

          book_id:
            bookId,

          page_number:
            pageNumber,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            "user_id,book_id",
        }
      );
  }

  /* =========================================================
     READ ALOUD
  ========================================================= */

  async function toggleReadAloud() {
    const audio =
      audioRef.current;

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
        "Could not play audio:",
        error
      );
    }
  }

  /* =========================================================
     SHARE
  ========================================================= */

  async function shareBook() {
    const shareUrl =
      `${window.location.origin}` +
      `/books/${bookSlug}/read` +
      `?page=${pageNumber}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text:
            `Read "${title}" with me on Read With Luke!`,
          url: shareUrl,
        });

        return;
      } catch {
        /*
         * User closed the
         * native share sheet.
         */
      }
    }

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        "Link copied!"
      );
    } catch {
      window.prompt(
        "Copy this link:",
        shareUrl
      );
    }
  }

  /* =========================================================
     PAGE NAVIGATION
  ========================================================= */

  function goBack() {
    if (
      pageNumber > 1
    ) {
      router.push(
        `/books/${bookSlug}/read?page=${
          pageNumber - 1
        }`
      );
    }
  }

  function goNext() {
    if (
      pageNumber <
      totalPages
    ) {
      router.push(
        `/books/${bookSlug}/read?page=${
          pageNumber + 1
        }`
      );
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="readerPage">

      {/* =====================================================
          AUDIO
      ===================================================== */}

      <audio
        ref={audioRef}
        src={
          audioUrl ||
          undefined
        }
        preload="metadata"
        onPlay={() =>
          setIsAudioPlaying(
            true
          )
        }
        onPause={() =>
          setIsAudioPlaying(
            false
          )
        }
        onEnded={() =>
          setIsAudioPlaying(
            false
          )
        }
      />

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <section className="readerImageSide">
        <img
          src={imageUrl}
          alt={`${title} page ${pageNumber}`}
        />

        {/* AUDIO WAVE */}

        {audioUrl && (
          <div
            className={`readerAudioWave ${
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
      </section>

      {/* =====================================================
          READER PANEL
      ===================================================== */}

      <aside className="readerPanel">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="readerDesktopTopBar">
          <Link
            href="/"
            className="readerMiniBtn"
          >
            HOME
          </Link>

          <Link
            href="/library"
            className="readerMiniBtn"
          >
            LIBRARY
          </Link>

          <div className="readerTopActions">
            <LikeButton
              bookId={
                bookId
              }
            />

            <BookmarkButton
              bookId={
                bookId
              }
              pageNumber={
                pageNumber
              }
            />

            <button
              type="button"
              onClick={
                shareBook
              }
              aria-label="Share"
            >
              <img
                src="/images/share.png"
                alt=""
              />
            </button>
          </div>
        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="readerHeaderRow">
          <div className="readerProgressRow">
            <span>
              Page{" "}
              {pageNumber}{" "}
              of{" "}
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

        {/* ===================================================
            STORY + FUNCTIONAL SCROLLBAR
        =================================================== */}

        <div className="readerStoryWrap">
          <div
            ref={storyRef}
            className="readerStoryText"
            onScroll={
              updateStoryScrollbar
            }
          >
            <h1>
              {title.toUpperCase()}
            </h1>

            <p>
              {text ||
                "This page is waiting for an adventure..."}
            </p>
          </div>

          {scrollThumb.visible && (
            <div
              className="readerScrollTrack"
              aria-hidden="true"
            >
              <span
                className="readerScrollThumb"
                style={{
                  height:
                    `${scrollThumb.height}%`,

                  top:
                    `${scrollThumb.top}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* ===================================================
            BOTTOM CONTROLS
        =================================================== */}

        <div className="readerControls">
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={
              goBack
            }
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

          {/* READ ALOUD */}

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
            disabled={
              !audioUrl
            }
          >
            {isAudioPlaying
              ? "PAUSE"
              : "READ ALOUD"}
          </button>

          {/* NEXT / FINISH */}

          {isLastPage ? (
            <button
              type="button"
              onClick={
                finishBook
              }
              className="readerFinishCircle"
              aria-label="Finish book"
            >
              ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={
                goNext
              }
              aria-label="Next page"
            >
              <img
                src="/images/icon-arrow-right.png"
                alt=""
              />
            </button>
          )}
        </div>
      </aside>
    </main>
  );
}
