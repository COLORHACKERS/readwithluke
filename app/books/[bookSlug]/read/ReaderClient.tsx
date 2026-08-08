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
  audioURL,
}: Props) {
  const router = useRouter();

  const progress = Math.max(
    4,
    Math.min((pageNumber / totalPages) * 100, 100)
  );

  const isLastPage =
    pageNumber === totalPages;

  useEffect(() => {
    saveProgress();
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
      .select("active_child_id")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(
        profileError.message
      );
    }

    if (profile?.active_child_id) {
      return profile.active_child_id;
    }

    /*
     * Fallback for older accounts that
     * existed before active_child_id
     * was added.
     */
    const {
      data: firstChild,
      error: childError,
    } = await supabase
      .from("children")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: true,
      })
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

    /*
     * Make this child the active reader
     * so we only need the fallback once.
     */
    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        active_child_id:
          firstChild.id,
      })
      .eq("id", userId);

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
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      router.push("/signup");
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
        .from("reading_history")
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
              new Date().toISOString(),
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
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    await supabase
      .from("book_bookmarks")
      .upsert(
        {
          user_id:
            user.id,

          book_id:
            bookId,

          page_number:
            pageNumber,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "user_id,book_id",
        }
      );
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
          url:
            shareUrl,
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

  function goBack() {
    if (pageNumber > 1) {
      router.push(
        `/books/${bookSlug}/read?page=${
          pageNumber - 1
        }`
      );
    }
  }

  function goNext() {
    if (
      pageNumber < totalPages
    ) {
      router.push(
        `/books/${bookSlug}/read?page=${
          pageNumber + 1
        }`
      );
    }
  }

  return (
    <main className="readerPage">
      <div className="readerImageSide">
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
            href="/library"
            className="readerMiniBtn"
          >
            LIBRARY
          </Link>

          <div className="readerTopActions">
            <LikeButton
              bookId={bookId}
            />

            <BookmarkButton
              bookId={bookId}
              pageNumber={
                pageNumber
              }
            />

            <button
              type="button"
              onClick={shareBook}
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
                  width:
                    `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="readerMenuLike">
            <LikeButton
              bookId={bookId}
            />
          </div>

          <button
            type="button"
            onClick={shareBook}
          >
            <img
              src="/images/share.png"
              alt=""
            />
            Share
          </button>
        </div>

        <div className="readerStoryText">
          <h1>
            {title.toUpperCase()}
          </h1>

          <p>
            {text ||
              "This page is waiting for an adventure..."}
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

          {isLastPage ? (
            <button
              type="button"
              className="readerFinishButton"
              onClick={
                finishBook
              }
            >
              FINISH +1 🪙
            </button>
          ) : (
            <button
              type="button"
              className="readerReadAloud"
            >
              READ ALOUD
            </button>
          )}

          <button
            type="button"
            onClick={goNext}
            className={
              isLastPage
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
