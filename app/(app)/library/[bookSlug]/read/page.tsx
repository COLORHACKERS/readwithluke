import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Mic, Sticker, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import "./reader.css";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", bookSlug)
    .single();

  if (!book) notFound();

  return (
    <main className="bookDetailPage">
      <Link href="/library" className="readerMenuButton">
        <Menu size={22} />
      </Link>

      <section className="bookHeroImage">
        <img
          src={book.hero_url || book.cover_url || "/images/pricing-adventure-bg.png"}
          alt={book.title}
        />
      </section>

      <aside className="bookStartPanel">
        <p className="eyebrow">OPEN THE BOOK</p>
        <h1>{book.title}</h1>

        <p>{book.description}</p>

        <div className="bookMeta">
          {book.age_level && <span>Ages {book.age_level}</span>}
          {book.story_type && <span>{book.story_type}</span>}
          {book.characters && <span>{book.characters}</span>}
        </div>

        <div className="bookActions">
          <Link href={`/books/${book.slug}/read?page=1`} className="bigReadButton">
            <BookOpen /> Read
          </Link>

          <Link href={`/read-along`} className="smallActionButton">
            <Mic /> Read Along
          </Link>

          <Link href={`/stickers`} className="smallActionButton">
            <Sticker /> Stickers
          </Link>
        </div>
      </aside>
    </main>
  );
}