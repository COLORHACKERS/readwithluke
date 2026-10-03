import Link from "next/link";
import ContentImage from "@/app/components/ContentImage";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getPublishedItem } from "@/lib/public-catalog";
import { pageMetadata } from "@/lib/seo";
import "./free-reads.css";

type FreeReadItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url?: string | null;
};

const FREE_BOOK_SLUG =
  "the-great-frog-croak-off";

const FREE_LEARN_SLUG =
  "the-moon-s-secret-powers-part-2";

export const metadata = pageMetadata("Free Online Stories for Kids", "Read a complete children's story and a learning adventure free. No signup or payment information required.", "/free-reads");

export default async function FreeReadsPage() {
  const [book, learnItem] = await Promise.all([
    getPublishedItem("books", FREE_BOOK_SLUG), getPublishedItem("learn_items", FREE_LEARN_SLUG),
  ]);

  function getImage(item: FreeReadItem) {
    return (
      item.cover_url ||
      item.image_url ||
      "/images/6to5ratio.png"
    );
  }

  return (
    <div className="freeReadsPage">
      <Header />

      <main className="freeReadsMain">
        <section className="freeReadsHero">
          <p className="freeReadsEyebrow">
            NO SIGNUP. NO CARD. JUST READ.
          </p>

          <h1>
            Free Stories for Kids
            <span>Two Adventures to Try!</span>
          </h1>

          <p className="freeReadsIntro">
            Read one complete story and one complete
            learning adventure with Luke. These two
            adventures are completely free and do not
            require an account.
          </p>

          <div className="freeReadsHighlights">
            <span>✓ Complete stories</span>
            <span>✓ No signup required</span>
            <span>✓ No payment information</span>
          </div>
        </section>

        {!book && !learnItem ? (
          <div className="freeReadsLoading">
            Free adventures are currently unavailable. Please check back soon.
          </div>
        ) : (
          <section className="freeReadsGrid">
            {book && (
              <article className="freeReadCard">
                <div className="freeReadImageWrap">
                  <ContentImage fill sizes="(max-width:700px) 100vw, 50vw" loading="lazy"
                    src={getImage(book)}
                    alt={book.title}
                  />

                  <span className="freeReadBadge">
                    FREE READING ADVENTURE
                  </span>
                </div>

                <div className="freeReadCardContent">
                  <p className="freeReadType">
                    READ WITH LUKE
                  </p>

                  <h2>{book.title}</h2>

                  <p>
                    {book.description ||
                      "Join Luke for a complete imaginative reading adventure."}
                  </p>

                  <Link
                    href={`/books/${book.slug}/read`}
                    className="freeReadButton"
                  >
                    Read the Full Story
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )}

            {learnItem && (
              <article className="freeReadCard">
                <div className="freeReadImageWrap">
                  <ContentImage fill sizes="(max-width:700px) 100vw, 50vw" loading="lazy"
                    src={getImage(learnItem)}
                    alt={learnItem.title}
                  />

                  <span className="freeReadBadge">
                    FREE LEARNING ADVENTURE
                  </span>
                </div>

                <div className="freeReadCardContent">
                  <p className="freeReadType">
                    LEARN WITH LUKE
                  </p>

                  <h2>{learnItem.title}</h2>

                  <p>
                    {learnItem.description ||
                      "Explore a complete learning adventure with Luke."}
                  </p>

                  <Link
                    href={`/learn/${learnItem.slug}/read?page=1`}
                    className="freeReadButton"
                  >
                    Start Learning
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )}
          </section>
        )}

        <section className="freeReadsMembership">
          <div>
            <p>READY FOR MORE?</p>

            <h2>
              Unlock Every Story and Learning Adventure
            </h2>

            <span>
              Continue exploring with unlimited access
              to Read With Luke and Learn With Luke.
            </span>
          </div>

          <Link
            href="/membership"
            className="freeReadsMembershipButton"
          >
            Explore Membership
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
