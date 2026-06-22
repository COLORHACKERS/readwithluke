"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  bookId: string;
};

export default function LikeButton({ bookId }: Props) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    loadLike();
  }, []);

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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in.");
      return;
    }

    if (liked) {
      await supabase
        .from("book_likes")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", user.id);

      setLiked(false);
      setLikes((v) => Math.max(v - 1, 0));
    } else {
      await supabase.from("book_likes").insert({
        book_id: bookId,
        user_id: user.id,
      });

      setLiked(true);
      setLikes((v) => v + 1);
    }
  }

  return (
    <button onClick={toggleLike} type="button">
      <img
        src={liked ? "/images/heart-filled.png" : "/images/heart.png"}
        alt="Like"
      />

      <span>{likes}</span>
    </button>
  );
}