import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import ReaderClient from "./ReaderClient";
import LearnGate from "./LearnGate";
import "@/app/books/[bookSlug]/read/reader.css";

type Props = {
  params: Promise<{
    learnSlug: string;
  }>;

  searchParams: Promise<{
    page?: string;
    worksheets?: string;
    complete?: string;
  }>;
};

type LearnWorksheet = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
};

export default async function LearnReadPage({
  params,
  searchParams,
}: Props) {
  const { learnSlug } = await params;

  const {
    page,
    worksheets: worksheetsParam,
    complete,
  } = await searchParams;

  const lessonCompleted =
    complete === "1";

  const requestedPage =
    Number(page || "1");

  const currentPage =
    Number.isFinite(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  /* =========================================================
     LOAD LEARN ITEM
  ========================================================= */

  const { data: item } =
    await supabase
      .from("learn_items")
      .select("*")
      .eq("slug", learnSlug)
      .maybeSingle();

  if (!item) {
    return (
      <main className="readerPage">
        <div className="readerEmpty">
          <h1>
            Learning item not found.
          </h1>

          <Link href="/learn">
            Back to Learn
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     LOAD LEARNING PAGES
  ========================================================= */

  const { data: pages } =
    await supabase
      .from("learn_pages")
      .select("*")
      .eq(
        "learn_item_id",
        item.id
      )
      .order("page_number", {
        ascending: true,
      });

  if (
    !pages ||
    pages.length === 0
  ) {
    return (
      <main className="readerPage">
        <div className="readerEmpty">
          <h1>
            No learning pages uploaded yet.
          </h1>

          <Link href="/admin/learn">
            Go to Learn Admin
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     LOAD WORKSHEETS
  ========================================================= */

  const {
    data: worksheetData,
  } = await supabase
    .from("learn_worksheets")
    .select(
      "id, image_url, title, description, sort_order"
    )
    .eq(
      "learn_item_id",
      item.id
    )
    .order("sort_order", {
      ascending: true,
    });

  const worksheets =
    (
      worksheetData as
        | LearnWorksheet[]
        | null
    ) || [];

  const hasWorksheets =
    worksheets.length > 0;

  /* =========================================================
     PAGE COUNTS
  ========================================================= */

  const worksheetPageNumber =
    pages.length + 1;

  const totalPages =
    pages.length +
    (hasWorksheets ? 1 : 0);

  const showingWorksheets =
    hasWorksheets &&
    (
      worksheetsParam === "1" ||
      currentPage ===
        worksheetPageNumber
    );

  /* =========================================================
     PRINTABLE ACTIVITIES PAGE
  ========================================================= */

  if (showingWorksheets) {
    const completionImage =
      item.image_url ||
      item.cover_url ||
      "/images/6to5ratio.png";

    return (
      <LearnGate>
        <div className="worksheetPageShell">
          <Header />

          <main className="worksheetReaderPage">
            {/* LEFT SIDE */}

            <section className="worksheetCompleteSide">
              <img
                src={completionImage}
                alt={item.title}
                className="worksheetCompleteImage"
              />

              <div className="worksheetCompleteShade" />

              <div className="worksheetCompleteContent">
                <div className="worksheetCompleteEyebrow">
                  LESSON
                </div>

                <h1>
                  {lessonCompleted
                    ? "COMPLETE!"
                    : "WORKSHEETS"}
                </h1>

                <p>
                  {worksheets.length}{" "}
                  printable{" "}
                  {worksheets.length === 1
                    ? "activity"
                    : "activities"}{" "}
                  unlocked
                </p>
              </div>
            </section>

            {/* RIGHT SIDE */}

            <section className="worksheetActivitiesSide">
              <div className="worksheetTopNav">
                <Link
                  href={`/learn/${item.slug}/read?page=${pages.length}`}
                  className="worksheetHomeButton"
                >
                  BACK
                </Link>

                <Link
                  href={`/learn/${item.slug}`}
                  className="worksheetBackLearnButton"
                >
                  BACK TO LEARN
                </Link>
              </div>

              <div className="worksheetProgressRow">
                <span>
                  Page{" "}
                  {worksheetPageNumber}{" "}
                  of {totalPages}
                </span>

                <strong>
                  {lessonCompleted
                    ? "COMPLETE! ★"
                    : "PRINTABLES"}
                </strong>
              </div>

              <div className="worksheetProgressBar">
                <span />
              </div>

              <div className="worksheetHeading">
                <h2>
                  PRINTABLE ACTIVITIES
                </h2>

                <p>
                  Keep the learning going
                  with these fun activities.
                  Download, print, and
                  explore more with Luke!
                </p>
              </div>

              <div className="worksheetCards">
                {worksheets.map(
                  (
                    worksheet,
                    index
                  ) => {
                    const fallbackTitle =
                      `WORKSHEET ${
                        index + 1
                      }`;

                    const worksheetTitle =
                      worksheet.title?.trim() ||
                      fallbackTitle;

                    const worksheetDescription =
                      worksheet.description?.trim() ||
                      "Print this activity and keep learning!";

                    return (
                      <article
                        className="worksheetCard"
                        key={
                          worksheet.id
                        }
                      >
                        <img
                          src={
                            worksheet.image_url
                          }
                          alt={
                            worksheetTitle
                          }
                          className="worksheetCardImage"
                        />

                        <div className="worksheetCardText">
                          <h3>
                            {
                              worksheetTitle
                            }
                          </h3>

                          <p>
                            {
                              worksheetDescription
                            }
                          </p>
                        </div>

                        <div className="worksheetCardActions">
                          <a
                            href={
                              worksheet.image_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="worksheetPreviewButton"
                          >
                            PREVIEW
                          </a>

                          <a
                            href={
                              worksheet.image_url
                            }
                            download
                            className="worksheetDownloadButton"
                          >
                            ↓ DOWNLOAD
                          </a>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>

              <div className="worksheetPrintNote">
                PNG • Standard 8.5 × 11
                in • Print at home
              </div>

              {/* WORKSHEET PAGE CONTROLS */}

              <div className="worksheetPanelControls">
                <Link
                  href={`/learn/${item.slug}/read?page=${pages.length}`}
                  className="worksheetArrowButton"
                  aria-label="Previous page"
                >
                  ←
                </Link>

                <div className="worksheetGreatWork">
                  {lessonCompleted
                    ? "GREAT WORK, EXPLORER! ★"
                    : "PRINTABLE ACTIVITIES"}
                </div>

                <Link
                  href="/learn"
                  className="worksheetArrowButton"
                  aria-label="Back to Learn"
                >
                  →
                </Link>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </LearnGate>
    );
  }

  /* =========================================================
     NORMAL LEARNING PAGE
  ========================================================= */

  const pageData =
    pages.find(
      (learnPage) =>
        learnPage.page_number ===
        currentPage
    ) || pages[0];

  const imageUrl =
    pageData.image_url ||
    item.cover_url ||
    item.image_url ||
    "/images/6to5ratio.png";

  /* =========================================================
     NORMAL READER
  ========================================================= */

  return (
    <LearnGate>
      <ReaderClient
        learnSlug={item.slug}
        title={item.title}
        pageNumber={
          pageData.page_number
        }
        totalPages={totalPages}
        lessonPageCount={
          pages.length
        }
        hasWorksheets={
          hasWorksheets
        }
        imageUrl={imageUrl}
        text={
          pageData.text || ""
        }
        audioUrl={
          pageData.audio_url || ""
        }
      />
    </LearnGate>
  );
}
