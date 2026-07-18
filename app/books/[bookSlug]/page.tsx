import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShareButton from "@/app/components/ShareButton";
import { supabase } from "@/lib/supabase";
import "./bookPreview.css";

type Props = {
  params: Promise<{
    bookSlug: string;
  }>;
};

const SITE_URL = "https://readwithluke.com";

const DEFAULT_DESCRIPTION =
  "Stories for kids that are magical, exciting, and cinematic like movies. Fascinating facts and fun learning that inspires imagination.";

function makeAbsoluteUrl(url: string | null | undefined) {
  if (!url) {
    return `${SITE_URL}/images/6to5ratio.png`;
  }

  try {
    return new URL(url, SITE_URL).toString();
  } catch {
    return `${SITE_URL}/images/6to5ratio.png`;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { bookSlug } = await params;

  const { data: book } = await supabase
    .from("books")
    .select(
      `
        title,
        slug,
        description,
        cover_url,
        hero_url,
        hero_image_url,
        is_published,
        seo_title,
        seo_description,
        seo_image_url,
        seo_noindex
      `
    )
    .eq("slug", bookSlug)
    .maybeSingle();

  if (!book) {
    return {
      title: "Book Not Found | Read With Luke",
      description: "This Read With Luke book could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    book.seo_title?.trim() ||
    `${book.title} | Read With Luke`;

  const description =
    book.seo_description?.trim() ||
    book.description?.trim() ||
    DEFAULT_DESCRIPTION;

  const canonicalUrl = `${SITE_URL}/library/${book.slug}`;

  const socialImage = makeAbsoluteUrl(
    book.seo_image_url ||
      book.cover_url ||
      book.hero_url ||
      book.hero_image_url
  );

  const shouldHideFromSearch =
    book.seo_noindex === true ||
    book.is_published !== true;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: !shouldHideFromSearch,
      follow: true,
      googleBot: {
        index: !shouldHideFromSearch,
        follow: true,
      },
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Read With Luke",
      type: "article",
      images: [
        {
          url: socialImage,
          alt: book.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default async function BookPreviewPage({
  params,
}: Props) {
  const { bookSlug } = await params;

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", bookSlug)
    .maybeSingle();

  if (!book) {
    return (
      <>
        <Header />

        <main className="bookPreviewPage bookPreviewEmpty">
          <h1>Book not found.</h1>

          <Link
            href="/library"
            className="previewOutlineButton"
          >
            BACK TO LIBRARY
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const { count } = await supabase
    .from("book_pages")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("book_id", book.id);

  const heroImage =
    book.hero_url ||
    book.hero_image_url ||
    book.cover_url ||
    "/images/6to5ratio.png";

  const shareDescription =
    book.seo_description ||
    book.description ||
    "Read this amazing story with me on Read With Luke!";

  const shareUrl = `${SITE_URL}/library/${book.slug}`;

  return (
    <>
      <Header />

      <main className="bookPreviewPage">
        <img
          src={heroImage}
          alt={book.title}
          className="bookPreviewBg"
        />

        <div className="bookPreviewShade" />

        <section className="previewContent">
          <div className="previewProgressText">
            Progress: Page 1 of {count || 20}
          </div>

          <div className="previewProgressBar">
            <span />
          </div>

          <h1>{book.title}</h1>

          <p className="previewDescription">
            {book.description || DEFAULT_DESCRIPTION}
          </p>

          <div className="previewButtons">
            <Link
              href={`/books/${book.slug}/read?page=1`}
              className="previewStartButton"
            >
              START READING
            </Link>

            <Link
              href="/library"
              className="previewOutlineButton"
            >
              BACK TO LIBRARY
            </Link>
          </div>

          <div className="readerTopIcons">
            <button type="button">
              <img
                src="/images/heart.png"
                alt="Favorite"
              />
            </button>

            <button type="button">
              <img
                src="/images/bookmark.png"
                alt="Save"
              />
            </button>

            <ShareButton
              title={book.seo_title || book.title}
              text={shareDescription}
              url={shareUrl}
            />
          </div>
        </section>

        <div className="previewBottomTagline">
          MYSTERY. FRIENDSHIP. ADVENTURE.
        </div>
      </main>

      <Footer />
    </>
  );
}
