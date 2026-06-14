"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import "./reader.css";

const pages = [
  {
    type: "image",
    image: "/reader/test-page-1.jpg",
  },
  {
    type: "text",
    text: "Luke found a tiny golden key beside the old bait shop. It shimmered like sunlight on the water.",
  },
  {
    type: "image",
    image: "/reader/test-page-2.jpg",
  },
  {
    type: "text",
    text: "Professor Ribbit adjusted his headphones. “That key belongs to the lighthouse,” he whispered.",
  },
];

export default function ReaderPage() {
  const [page, setPage] = useState(0);
  const current = pages[page];

  function nextPage() {
    setPage((p) => Math.min(p + 1, pages.length - 1));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 0));
  }

  return (
    <main className="readerShell">
      <header className="readerTop">
        <Link href="/library">
          <ArrowLeft /> Library
        </Link>

        <strong>The Mystery Key</strong>

        <span>
          {page + 1} / {pages.length}
        </span>
      </header>

      <section className="readerStage">
        <button onClick={prevPage} className="readerArrow left">
          <ChevronLeft />
        </button>

        <article className={`bookPage ${current.type}`}>
          {current.type === "image" ? (
            <img src={current.image} alt="" />
          ) : (
            <p>{current.text}</p>
          )}
        </article>

        <button onClick={nextPage} className="readerArrow right">
          <ChevronRight />
        </button>
      </section>
    </main>
  );
}