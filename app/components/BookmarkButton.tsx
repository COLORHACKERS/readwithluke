"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  bookId: string;
  pageNumber: number;
};

export default function BookmarkButton({ bookId, pageNumber }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBookmark();
  }, [bookId]);

  async function loadBookmark() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("book_bookmarks")
      .select("id")
      .eq("book_id", bookId)
      .eq("user_id", user.id)
      .maybeSingle();

    setBookmarked(!!data);
  }

  async function toggleBookmark() {
    if (saving) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      alert("Please sign in.");
      return;
    }

    if (bookmarked) {
      const { error } = await supabase
        .from("book_bookmarks")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", user.id);

      if (!error) {
        setBookmarked(false);
      }
    } else {
      const { error } = await supabase.from("book_bookmarks").upsert(
        {
          book_id: bookId,
          user_id: user.id,
          page_number: pageNumber,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,book_id",
        }
      );

      if (!error) {
        setBookmarked(true);
      }
    }

    setSaving(false);
  }

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`bookmarkButton ${bookmarked ? "bookmarked" : ""}`}
      aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
      disabled={saving}
    >
      <img src="/images/bookmark.png" alt="" />
    </button>
  );
}
