import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Pencil,
  FileText,
  Eye,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageStoriesPage() {
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F1E6] p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-[#13294B] font-bold"
        >
          <ArrowLeft size={18} />
          Back to Admin
        </Link>

        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6542D]">
            Story Management
          </p>

          <h1 className="mt-2 text-5xl font-black text-[#13294B]">
            Manage Stories
          </h1>

          <p className="mt-3 text-lg text-[#13294B]/70">
            Edit stories, update images, manage pages, and preview books.
          </p>
        </div>

        {!books?.length ? (
          <div className="rounded-[32px] border border-[#E6DED0] bg-white p-10">
            <h2 className="text-2xl font-black text-[#13294B]">
              No stories found
            </h2>

            <p className="mt-2 text-[#13294B]/70">
              Create your first story from the admin dashboard.
            </p>

            <Link
              href="/admin"
              className="mt-6 inline-flex rounded-full bg-[#F5A400] px-6 py-3 font-black text-white"
            >
              Create Story
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="overflow-hidden rounded-[32px] border border-[#E6DED0] bg-white"
              >
                <div className="grid md:grid-cols-[220px_1fr]">
                  <div className="h-[220px] bg-[#F8F1E6]">
                    <img
                      src={
                        book.cover_url ||
                        book.hero_url ||
                        "/images/pricing-adventure-bg.png"
                      }
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-[#13294B]">
                          {book.title}
                        </h2>

                        <p className="mt-2 text-sm text-[#13294B]/60">
                          {book.slug}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {book.age_level && (
                            <span className="rounded-full bg-[#F8F1E6] px-3 py-1 text-sm font-bold text-[#13294B]">
                              Age {book.age_level}
                            </span>
                          )}

                          {book.story_type && (
                            <span className="rounded-full bg-[#F8F1E6] px-3 py-1 text-sm font-bold text-[#13294B]">
                              {book.story_type}
                            </span>
                          )}

                          {book.is_published ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/books/${book.id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#13294B] px-5 py-3 font-black text-white"
                        >
                          <Pencil size={18} />
                          Edit Book
                        </Link>

                        <Link
                          href={`/admin/books/${book.id}/pages`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#F5A400] px-5 py-3 font-black text-white"
                        >
                          <FileText size={18} />
                          Edit Pages
                        </Link>

                        <Link
                          href={`/books/${book.slug}/read?page=1`}
                          className="inline-flex items-center gap-2 rounded-full border-2 border-[#13294B] px-5 py-3 font-black text-[#13294B]"
                        >
                          <Eye size={18} />
                          Preview
                        </Link>
                      </div>
                    </div>

                    {book.description && (
                      <p className="mt-6 max-w-4xl text-[#13294B]/80">
                        {book.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}