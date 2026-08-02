import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./mushrooms.css";

export const metadata: Metadata = {
  title: "Mushrooms for Kids: Fun Facts, Parts and How They Grow",
  description:
    "Help kids discover how mushrooms grow, what fungi are, the parts of a mushroom and fascinating mushroom facts through a playful learning adventure.",
  alternates: {
    canonical: "https://www.readwithluke.com/learn/mushrooms-for-kids",
  },
  openGraph: {
    title: "Mushrooms for Kids",
    description:
      "A fun introduction to mushrooms, fungi and how they grow for curious young learners.",
    url: "https://www.readwithluke.com/learn/mushrooms-for-kids",
    siteName: "Read With Luke",
    type: "article",
    images: [
      {
        url: "/images/mushrooms-for-kids-share.jpg",
        width: 1200,
        height: 630,
        alt: "Mushrooms for kids learning adventure",
      },
    ],
  },
};

const mushroomFacts = [
  {
    title: "Mushrooms are fungi",
    text: "Mushrooms are not plants or animals. They belong to a group of living things called fungi.",
  },
  {
    title: "Most of the fungus is hidden",
    text: "The mushroom we see is only one part. A web of tiny threads called mycelium often grows underground or inside wood.",
  },
  {
    title: "Mushrooms release spores",
    text: "Instead of making seeds, mushrooms release microscopic spores that can grow into new fungi.",
  },
];

export default function MushroomsForKidsPage() {
  return (
    <div className="mushroomSeoPage">
      <Header />

      <main>
        <section className="mushroomHero">
          <div className="mushroomHeroContent">
            <p className="mushroomEyebrow">LEARN WITH LUKE</p>

            <h1>Mushrooms for Kids</h1>

            <p className="mushroomIntro">
              Mushrooms are strange, surprising and important living things.
              Discover what mushrooms are, how they grow and why forests need
              fungi.
            </p>

            <Link
              href="/learn/the-wild-world-of-mushrooms-part-1"
              className="mushroomPrimaryButton"
            >
              Start the Mushroom Adventure
            </Link>
          </div>

          <img
            src="/images/mushrooms-for-kids-hero.jpg"
            alt="Colorful mushrooms growing in a forest for children to explore"
            className="mushroomHeroImage"
          />
        </section>

        <section className="mushroomSection">
          <p className="sectionLabel">WHAT IS A MUSHROOM?</p>

          <h2>A mushroom is part of a fungus</h2>

          <p>
            A mushroom is the part of a fungus that helps it reproduce. It can
            appear above the soil, on fallen trees or in other damp places.
            Underneath, the fungus may spread through a network of fine threads
            called mycelium.
          </p>
        </section>

        <section className="mushroomFactsSection">
          <div className="sectionHeading">
            <p className="sectionLabel">FUN FACTS</p>
            <h2>Three mushroom facts for curious kids</h2>
          </div>

          <div className="mushroomFactGrid">
            {mushroomFacts.map((fact) => (
              <article className="mushroomFactCard" key={fact.title}>
                <h3>{fact.title}</h3>
                <p>{fact.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mushroomSection mushroomParts">
          <div>
            <p className="sectionLabel">PARTS OF A MUSHROOM</p>

            <h2>What are the main parts?</h2>

            <p>
              Many mushrooms have a cap on top, a stem underneath and gills or
              pores that release spores. Different species can look completely
              different, so children should never touch or eat wild mushrooms
              without a knowledgeable adult.
            </p>
          </div>

          <img
            src="/images/parts-of-a-mushroom.jpg"
            alt="Simple educational diagram showing the cap, gills and stem of a mushroom"
          />
        </section>

        <section className="mushroomCta">
          <p className="sectionLabel">KEEP EXPLORING</p>

          <h2>Enter the wild world of mushrooms</h2>

          <p>
            Follow Luke on a visual learning adventure filled with colorful
            fungi, forest discoveries and surprising mushroom facts.
          </p>

          <Link
            href="/learn/the-wild-world-of-mushrooms-part-1"
            className="mushroomPrimaryButton"
          >
            Explore the Learning Story
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
