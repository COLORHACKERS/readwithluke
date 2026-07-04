"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  bookId: string;
};

export default function LikeButton({ bookId }: Props) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLike();
  }, [bookId]);

  async function loadLike() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { count } = await supabase
      .from("book_likes")
      .select("*", { count: "exact", head: true })
      .eq("book_id", bookId);

    setLikes(count || 0);

    if (!user) return;

    const { data } = await supabase
      .from("book_likes")
      .select("id")
      .eq("book_id", bookId)
      .eq("user_id", user.id)
      .maybeSingle();

    setLiked(!!data);
  }

  async function toggleLike() {
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

    if (liked) {
      const { error } = await supabase
        .from("book_likes")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", user.id);

      if (!error) {
        setLiked(false);
        setLikes((v) => Math.max(v - 1, 0));
      }
    } else {
      const { error } = await supabase.from("book_likes").upsert(
        {
          book_id: bookId,
          user_id: user.id,
        },
        {
          onConflict: "user_id,book_id",
        }
      );

      if (!error) {
        setLiked(true);
        setLikes((v) => v + 1);
      }
    }

    setSaving(false);
  }

  return (
    <button
      type="button"
      onClick={toggleLike}
      className={`likeButton ${liked ? "liked" : ""}`}
      aria-label={liked ? "Unlike story" : "Like story"}
      disabled={saving}
    >
      <img src="/images/heart-like.png" alt="" />
      <span>{likes}</span>
    </button>
  );
}
