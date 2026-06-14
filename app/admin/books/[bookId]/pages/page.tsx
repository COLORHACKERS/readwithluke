"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/app/components/header";

type BookPage = {
  page_number: number;
  page_text: string | null;
  page_image_url: string | null;
};

export default function BookPagesPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const totalPages = 20;

  const [pageNumber, setPageNumber] = useState(1);
  const [pageText, setPageText] = useState("");
  const [pageImage, setPageImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [savedPages, setSavedPages] = useState<BookPage[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);


  const currentSavedPage = savedPages.find(
    (p) => p.page_number === pageNumber
  );

  const completedCount = savedPages.length;

  const previewPage = useMemo(() => {
  return {
    page_number: pageNumber,
    page_text: pageText || currentSavedPage?.page_text || "",
    page_image_url: imagePreview || currentSavedPage?.page_image_url || "",
  };
}, [pageNumber, pageText, imagePreview, currentSavedPage]);

  useEffect(() => {
    loadPages();
  }, [bookId]);

  useEffect(() => {
    const saved = savedPages.find((p) => p.page_number === pageNumber);

    setPageText(saved?.page_text || "");
    setPageImage(null);
    setImagePreview(saved?.page_image_url || "");
  }, [pageNumber, savedPages]);

  async function loadPages() {
    const { data, error } = await supabase
      .from("book_pages")
      .select("page_number,page_text,page_image_url")
      .eq("book_id", bookId)
      .order("page_number", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSavedPages(data || []);
  }

  async function uploadPageImage(file: File) {
    const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${bookId}/page-${pageNumber}-${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from("book-pages")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("book-pages").getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function savePage() {
    setMessage("");

    if (!pageText.trim()) {
  setMessage("Please enter story text.");
  return;
}

if (!pageImage && !currentSavedPage?.page_image_url) {
  setMessage("Please upload an image.");
  return;
}

    setIsSaving(true);
    setProgress(15);

    try {
      let imageUrl = currentSavedPage?.page_image_url || "";

     if (pageImage) {
  setProgress(45);
  imageUrl = await uploadPageImage(pageImage);
}

      setProgress(75);

      const { error } = await supabase.from("book_pages").upsert(
        {
          book_id: bookId,
          page_number: pageNumber,
         page_text: pageText,
page_image_url: imageUrl,
        },
        {
          onConflict: "book_id,page_number",
        }
      );

      if (error) throw error;

      setProgress(100);
      await loadPages();
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setIsSaving(false);
        setProgress(0);

        if (pageNumber < totalPages) {
          setPageNumber(pageNumber + 1);
        }
      }, 700);
    } catch (error: any) {
      setMessage(error.message);
      setProgress(0);
      setIsSaving(false);
    }
  }

  function handleImageSelect(file: File | null) {
    setPageImage(file);

    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }
  async function publishBook() {
  setMessage("");

  if (savedPages.length < totalPages) {
    setMessage(`Please upload all ${totalPages} pages before publishing.`);
    return;
  }

  const { error } = await supabase
    .from("books")
    .update({
      is_published: true,
    })
    .eq("id", bookId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage("✅ Book published! Check the Library page.");
}

  return (
    <main className="min-h-screen bg-[#F8F1E6] px-4 py-8 text-[#13294B]">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>
            <h2 className="text-3xl font-black">Page Saved!</h2>
            <p className="mt-3 text-slate-600">Page {pageNumber} updated.</p>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[420px_1fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#C6542D]">
            Admin Upload
          </p>

          <h1 className="mt-2 text-4xl font-black">Upload Book Pages</h1>

          <p className="mt-3 text-sm text-slate-500">Book ID: {bookId}</p>

          <div className="mt-6 rounded-3xl bg-[#13294B] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">
                  Page {pageNumber} of {totalPages}
                </h2>
                <p className="mt-1 text-sm font-bold tracking-[0.2em]">
                  IMAGE + TEXT PAGE
                </p>
              </div>

              <div className="text-right text-sm font-black">
                {completedCount}/{totalPages}
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${Math.round((completedCount / totalPages) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const num = index + 1;
              const saved = savedPages.some((p) => p.page_number === num);

              return (
                <button
                  key={num}
                  onClick={() => setPageNumber(num)}
                  className={`rounded-xl border py-2 text-sm font-black ${
                    pageNumber === num
                      ? "bg-[#C6542D] text-white"
                      : saved
                      ? "bg-green-100 text-green-800"
                      : "bg-white text-[#13294B]"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {isSaving && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Saving page...</span>
                <span>{progress}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#13294B] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6">
  <label className="font-black">Story Text</label>

  <textarea
    rows={8}
    value={pageText}
    onChange={(e) => setPageText(e.target.value)}
    className="mt-2 w-full rounded-3xl border p-5"
    placeholder="Enter story text..."
  />
</div>

<div className="mt-6">
  <label className="font-black">Landscape Illustration</label>

  <input
    type="file"
    accept="image/*"
    className="mt-2 w-full rounded-3xl border p-5"
    onChange={(e) =>
      handleImageSelect(e.target.files?.[0] || null)
    }
  />
</div>
          <button
            onClick={savePage}
            disabled={isSaving}
            className="mt-6 w-full rounded-full bg-[#13294B] px-8 py-5 text-xl font-black text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : `Save Page ${pageNumber}`}
          </button>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="mt-3 w-full rounded-full border-2 border-[#13294B] px-8 py-4 text-lg font-black text-[#13294B]"
          >
            {previewMode ? "Exit Full Book Preview" : "Preview iPad Reader"}
          </button>
          <button
  onClick={publishBook}
  className="mt-3 w-full rounded-full bg-[#C6542D] px-8 py-4 text-lg font-black text-white"
>
  Publish Book To Library
</button>

          {message && <p className="mt-5 font-bold text-red-600">{message}</p>}
        </section>

        <section className="rounded-[32px] bg-[#13294B] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-200">
                iPad Full Bleed Test
              </p>
              <h2 className="text-3xl font-black">
                {previewMode ? "Book Preview" : `Page ${pageNumber}`}
              </h2>
            </div>
          </div>

          {!previewMode ? (
            <IPadPagePreview page={previewPage} />
          ) : (
            <IPadBookPreview pages={savedPages} totalPages={totalPages} />
          )}
        </section>
      </div>
    </main>
  );
}

function IPadPagePreview({ page }: { page: BookPage }) {
  const textLength = page.page_text?.length || 0;

  const textSize =
    textLength < 220
      ? "text-[clamp(18px,1.8vw,24px)]"
      : textLength < 420
      ? "text-[clamp(15px,1.35vw,19px)]"
      : "text-[clamp(13px,1.05vw,16px)]";

  return (
    <div className="mx-auto aspect-[4/3] w-full max-w-6xl overflow-hidden rounded-[38px] border-[14px] border-black bg-white shadow-2xl">
      <div className="flex h-full flex-col bg-white">
        <div className="grid min-h-0 flex-1 grid-cols-[1.45fr_0.85fr] gap-8 px-7 pt-7">
          <div className="relative min-h-0 overflow-hidden rounded-[28px] bg-slate-100">
            <button className="absolute left-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7C948] text-2xl font-black text-[#13294B] shadow">
              ←
            </button>

            {page.page_image_url ? (
              <img
                src={page.page_image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black text-slate-400">
                Upload Landscape Image
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-col px-4 pt-8">
            <p className="shrink-0 text-sm font-bold text-slate-400">
              Page {page.page_number} of 20
            </p>

            <h2 className="mt-4 shrink-0 text-4xl font-black text-[#13294B]">
              Page {page.page_number}
            </h2>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-2">
              <p className={`${textSize} font-medium leading-[1.65] text-[#13294B]`}>
                {page.page_text || "Your story text will appear here."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid h-[96px] shrink-0 grid-cols-3 items-center px-24 pb-4 pt-2 text-center">
          <div>
            <button className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7C948] text-2xl font-black text-[#13294B] shadow">
              ←
            </button>
            <p className="mt-1 text-xs font-black text-[#13294B]">Previous</p>
          </div>

          <div>
            <button className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D82B7] text-xl font-black text-white shadow">
              🔊
            </button>
            <p className="mt-1 text-xs font-black text-[#13294B]">Read to Me</p>
          </div>

          <div>
            <button className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7C948] text-2xl font-black text-[#13294B] shadow">
              →
            </button>
            <p className="mt-1 text-xs font-black text-[#13294B]">Next</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IPadBookPreview({
  pages,
  totalPages,
}: {
  pages: BookPage[];
  totalPages: number;
}) {
  const [readerPage, setReaderPage] = useState(1);

  const current = pages.find((p) => p.page_number === readerPage);
  const isTextPage = readerPage % 2 === 1;

  return (
    <div>
      <div className="mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-[38px] border-[14px] border-black bg-white shadow-2xl">
        {isTextPage ? (
          <div className="flex h-full w-full items-center justify-center bg-[#F8F1E6] p-[7vw] text-center">
            <p className="max-w-3xl text-balance text-[clamp(28px,5vw,64px)] font-black leading-tight text-[#13294B]">
              {current?.page_text || `Page ${readerPage} text missing.`}
            </p>
          </div>
        ) : current?.page_image_url ? (
          <img
            src={current.page_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-black text-slate-400">
            Page {readerPage} image missing.
          </div>
        )}
      </div>

      <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between gap-4">
        <button
          onClick={() => setReaderPage(Math.max(1, readerPage - 1))}
          className="rounded-full bg-white px-6 py-3 font-black text-[#13294B]"
        >
          ← Back
        </button>

        <p className="font-black text-white">
          Page {readerPage} of {totalPages}
        </p>

        <button
          onClick={() => setReaderPage(Math.min(totalPages, readerPage + 1))}
          className="rounded-full bg-white px-6 py-3 font-black text-[#13294B]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}