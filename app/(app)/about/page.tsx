import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./about.css";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="aboutPage">
        {/* HERO */}
        <section className="aboutHero">
          <div className="aboutHeroCopy">
            <p className="aboutEyebrow">
              THE STORY BEHIND READ WITH LUKE
            </p>

            <h1>
              HEY, I&apos;M LUKE!
              <span>7 GOING ON 8.</span>
            </h1>

            <p className="aboutHeroIntro">
              I love to read, tell stories, explore,
              build things, find weird bugs, learn
              about animals and ask a LOT of
              questions.
            </p>

            <p className="aboutHeroIntro">
              Read With Luke started with the things
              I&apos;m curious about, the adventures
              I have and the stories I imagine.
            </p>

            <Link href="/library" className="aboutHeroButton">
              READ WITH ME →
            </Link>
          </div>

          <div className="aboutHeroImage">
            <img
              src="/images/Luke-membership.png"
              alt="Luke from Read With Luke"
            />
          </div>
        </section>

        {/* LUKE STORY */}
        <section className="aboutStory">
          <div className="aboutStoryHeading">
            <span />
            <h2>WHERE THE STORIES COME FROM</h2>
            <span />
          </div>

          <div className="aboutStoryGrid">
            <article className="aboutStoryCard">
              <div className="aboutStoryNumber">01</div>

              <h3>REAL ADVENTURES</h3>

              <p>
                A lot of our Learn With Luke adventures
                begin right here on our homestead.
              </p>

              <p>
                Animals, gardens, weather, mushrooms,
                bugs, the ocean, things we build and
                questions that pop into my head can all
                turn into something new to learn about.
              </p>
            </article>

            <article className="aboutStoryCard">
              <div className="aboutStoryNumber">02</div>

              <h3>BIG IMAGINATION</h3>

              <p>
                The stories are where my imagination
                gets to go wild.
              </p>

              <p>
                Sometimes an idea starts with something
                that really happened. Sometimes it
                starts with a funny character, a place
                I want to explore or a giant
                &quot;what if?&quot;
              </p>
            </article>

            <article className="aboutStoryCard">
              <div className="aboutStoryNumber">03</div>

              <h3>MADE TOGETHER</h3>

              <p>
                My dad and I work together to turn the
                ideas into Read With Luke adventures.
              </p>

              <p>
                We work on the story together, and he
                helps create the fun cinematic images
                that make the characters, worlds and
                adventures feel real.
              </p>
            </article>
          </div>
        </section>

        {/* QUOTE */}
        <section className="aboutQuote">
          <div className="aboutQuoteImage">
            <img
              src="/images/luke-reading-activities.png"
              alt="Luke reading and exploring"
            />
          </div>

          <div className="aboutQuoteCopy">
            <p className="aboutQuoteMark">“</p>

            <h2>
              I THINK READING SHOULD FEEL LIKE
              AN ADVENTURE.
            </h2>

            <p>
              Not homework. Not something you have to
              do. Something you actually want to open
              and see what happens next.
            </p>

            <strong>— LUKE</strong>
          </div>
        </section>

        {/* WHY */}
        <section className="aboutWhy">
          <p className="aboutEyebrow">
            WHY WE MADE IT
          </p>

          <h2>
            STORIES FOR CURIOUS KIDS.
          </h2>

          <p className="aboutWhyIntro">
            Read With Luke is a place for kids who
            wonder about everything.
          </p>

          <div className="aboutWhyGrid">
            <div>
              <strong>READ</strong>
              <p>
                Illustrated stories made to pull kids
                into the adventure.
              </p>
            </div>

            <div>
              <strong>DISCOVER</strong>
              <p>
                Learning inspired by nature, science,
                animals, history and everyday
                adventures.
              </p>
            </div>

            <div>
              <strong>IMAGINE</strong>
              <p>
                A place where curiosity can turn into a
                story and a question can turn into an
                adventure.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="aboutCta">
          <div>
            <p>READY FOR AN ADVENTURE?</p>

            <h2>
              COME READ &amp; LEARN WITH LUKE.
            </h2>
          </div>

          <div className="aboutCtaButtons">
            <Link href="/library">
              READ STORIES
            </Link>

            <Link href="/learn">
              START LEARNING
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
