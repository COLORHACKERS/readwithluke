import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShareButton from "@/app/components/ShareButton";
import { supabase } from "@/lib/supabase";
import "@/app/books/[bookSlug]/bookPreview.css";

type Props = {
  params: Promise<{
    learnSlug: string;
  }>;
};

const SITE_URL = "https://readwithluke.com";

const DEFAULT_DESCRIPTION =
  "Discover something awesome with Learn With Luke. Explore science, nature, history, animals, space, and more through fun learning adventures.";

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

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { learnSlug } = await params;

  const { data: item } = await supabase
    .from("learn_items")
    .select(
      `
        title,
        slug,
        description,
        cover_url,
        image_url,
        is_published,
        seo_title,
        seo_description,
        seo_image_url,
        seo_noindex
      `
    )
    .eq("slug", learnSlug)
    .maybeSingle();

  if (!item) {
    return {
      title: "Learning Post Not Found | Read With Luke",
      description:
        "This Learn With Luke post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    item.seo_title?.trim() ||
    `${item.title} | Learn With Luke`;

  const description =
    item.seo_description?.trim() ||
    item.description?.trim() ||
    DEFAULT_DESCRIPTION;

  const canonicalUrl = `${SITE_URL}/learn/${item.slug}`;

  const socialImage = makeAbsoluteUrl(
    item.seo_image_url ||
      item.cover_url ||
      item.image_url
  );

  const shouldHideFromSearch =
    item.seo_noindex === true ||
    item.is_published !== true;

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
          alt: item.title,
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

/* =========================================================
   LEARN PREVIEW PAGE
========================================================= */

export default async function LearnPreviewPage({
  params,
}: Props) {
  const { learnSlug } = await params;

  const { data: item } = await supabase
    .from("learn_items")
    .select("*")
    .eq("slug", learnSlug)
    .maybeSingle();

  if (!item) {
    return (
      <>
        <Header />

        <main className="bookPreviewPage bookPreviewEmpty">
          <h1>Learning item not found.</h1>

          <Link
            href="/learn"
            className="previewOutlineButton"
          >
            BACK TO LEARN
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const { count } = await supabase
    .from("learn_pages")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("learn_item_id", item.id);

  const heroImage =
    item.image_url ||
    item.cover_url ||
    "/images/6to5ratio.png";

  const shareTitle =
    item.seo_title?.trim() ||
    item.title;

  const shareDescription =
    item.seo_description?.trim() ||
    item.description?.trim() ||
    "Learn something awesome with me on Read With Luke!";

  const shareUrl = `${SITE_URL}/learn/${item.slug}`;

  return (
    <>
      <Header />

      <main className="bookPreviewPage">
        <img
          src={heroImage}
          alt={item.title}
          className="bookPreviewBg"
        />

        <div className="bookPreviewShade" />

        <section className="previewContent">
          <div className="previewProgressText">
            Progress: Page 1 of {count || 1}
          </div>

          <div className="previewProgressBar">
            <span />
          </div>

          <h1>{item.title}</h1>

          <p className="previewDescription">
            {item.description || DEFAULT_DESCRIPTION}
          </p>

          <div className="previewButtons">
            <Link
              href={`/learn/${item.slug}/read?page=1`}
              className="previewStartButton"
            >
              START LEARNING
            </Link>

            <Link
              href="/learn"
              className="previewOutlineButton"
            >
              BACK TO LEARN
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
              title={shareTitle}
              text={shareDescription}
              url={shareUrl}
            />
          </div>
        </section>

        <div className="previewBottomTagline">
          LEARN. DISCOVER. EXPLORE.
        </div>
      </main>

      <Footer />
    </>
  );
}
