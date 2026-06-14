"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StoryPage = {
  pageNumber: number;
  text: string;
  image: string;
};

type Story = {
  id: string;
  title: string;
  cover: string;
  image: string;
  category: string;
  ageLevel: string;
  tags: string[];
  description: string;
  pages: StoryPage[];
  status: "draft" | "published";
};

export default function StoryReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const [story, setStory] = useState<Story | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const request = indexedDB.open("readWithLukeAdmin", 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("stories", "readonly");
      const store = tx.objectStore("stories");
      const getStory = store.get(params.id);

      getStory.onsuccess = () => {
        setStory(getStory.result || null);
        setLoading(false);
      };
    };

    request.onerror = () => {
      setLoading(false);
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#ffd21c] p-6 text-[#071a3a]">
        <p className="text-3xl font-black">Loading story...</p>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-[#ffd21c] p-6 text-[#071a3a]">
        <Link href="/library" className="font-black">
          ← Back to Library
        </Link>
        <p className="mt-8 text-3xl font-black">Story not found.</p>
      </main>
    );
  }

  const currentPage = story.pages?.[pageIndex];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#ffd21c] px-5 py-6 text-[#071a3a]">
      <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_55%,#ffd21c_0deg,#ffd21c_9deg,#ffe979_9deg,#ffe979_18deg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(#071a3a_1px,transparent_1px)] [background-size:18px_18px] opacity-20" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            href="/library"
            className="rounded-xl border-4 border-[#071a3a] bg-white px-5 py-3 font-black shadow-[5px_5px_0_#071a3a]"
          >
            ← LIBRARY
          </Link>

          <p className="rounded-xl border-4 border-[#071a3a] bg-[#d9efff] px-5 py-3 font-black shadow-[5px_5px_0_#071a3a]">
            Page {pageIndex + 1} of 20
          </p>
        </div>

        <div className="mt-8 rounded-[26px] border-4 border-[#071a3a] bg-white p-5 shadow-[10px_10px_0_#071a3a]">
          <h1 className="rwl-title text-5xl tracking-wide md:text-7xl">
            {story.title}
          </h1>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-[22px] border-4 border-[#071a3a] bg-[#d9efff]">
              {currentPage?.image ? (
                <img
                  src={currentPage.image}
                  alt={`Page ${pageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-2xl font-black">
                  No image for this page yet.
                </div>
              )}
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-[22px] border-4 border-[#071a3a] bg-[#fff8cf] p-8">
              <p className="font-black uppercase tracking-[0.2em] text-[#e6442e]">
                Page {pageIndex + 1}
              </p>

              <p className={`mt-6 font-black ${textSize(currentPage?.text || "")}`}>
                {currentPage?.text || "No text for this page yet."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((page) => Math.max(0, page - 1))}
              className="rounded-xl border-4 border-[#071a3a] bg-white px-8 py-4 text-xl font-black shadow-[5px_5px_0_#071a3a] disabled:opacity-40"
            >
              ← PREV
            </button>

            <button
              type="button"
              disabled={pageIndex === 19}
              onClick={() => setPageIndex((page) => Math.min(19, page + 1))}
              className="rounded-xl border-4 border-[#071a3a] bg-[#ffd21c] px-8 py-4 text-xl font-black shadow-[5px_5px_0_#071a3a] disabled:opacity-40"
            >
              NEXT →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function textSize(text: string) {
  if (text.length > 500) return "text-base leading-6";
  if (text.length > 320) return "text-lg leading-7";
  if (text.length > 180) return "text-xl leading-8";
  return "text-2xl leading-9";
}