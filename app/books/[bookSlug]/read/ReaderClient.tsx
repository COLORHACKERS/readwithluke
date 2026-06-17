"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  bookSlug: string;
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl: string;
  text: string;
};

function chunkTextByLines(text: string, maxLines = 14) {
  const cleanText = text || "No text added for this page yet.";
  const lines = cleanText.split("\n");
  const chunks: string[] = [];

  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join("\n"));
  }

  return chunks.length ? chunks : ["No text added for this page yet."];
}

export default function ReaderClient({
  bookSlug,
  title,
  pageNumber,
  totalPages,
  imageUrl,
  text,
}: Props) {
  const router = useRouter();
  const [textStep, setTextStep] = useState(0);

  const textChunks = useMemo(() => {
    return chunkTextByLines(text, 10);
  }, [text]);

  useEffect(() => {
    setTextStep(0);
  }, [pageNumber]);

  const safeTextStep = Math.min(textStep, textChunks.length - 1);
  const isFirstText = safeTextStep === 0;
  const isLastText = safeTextStep === textChunks.length - 1;

  function goBack() {
    if (!isFirstText) {
      setTextStep(safeTextStep - 1);
      return;
    }

    if (pageNumber > 1) {
      router.push(`/books/${bookSlug}/read?page=${pageNumber - 1}`);
    }
  }

  function goNext() {
    if (!isLastText) {
      setTextStep(safeTextStep + 1);
      return;
    }

    if (pageNumber < totalPages) {
      router.push(`/books/${bookSlug}/read?page=${pageNumber + 1}`);
    }
  }

  return (
    <main className="readerPage">
      <section className="readerShell">
        <div className="readerImage">
          <img src={imageUrl} alt={`${title} page ${pageNumber}`} />
        </div>

        <aside className="readerPanel">
          <div className="readerContent">
            <p className="readerEyebrow">
              Page {pageNumber} of {totalPages}
            </p>

            <h1>{title}</h1>

            <div className="readerTextBox">
              <p className="readerText">{textChunks[safeTextStep]}</p>
            </div>

            {textChunks.length > 1 && (
              <p className="textCounter">
                Text {safeTextStep + 1} of {textChunks.length}
              </p>
            )}
          </div>

          <div className="readerControls">
            <button
              onClick={goBack}
              className={pageNumber === 1 && isFirstText ? "disabledCircle" : ""}
            >
              ←
            </button>

            <button className="sound">🔊</button>

            <button
              onClick={goNext}
              className={
                pageNumber === totalPages && isLastText ? "disabledCircle" : ""
              }
            >
              →
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}