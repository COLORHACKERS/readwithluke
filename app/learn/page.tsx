"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./learn.css";

const lessons = [
  {
    id: 1,
    title: "Treehouse Mysteries Ep.1",
    image: "/images/learn-1.jpg",
    description:
      "A story about Jack and his friends who solve mysteries in his treehouse.",
  },
  {
    id: 2,
    title: "Sammy Finds Her Way Home",
    image: "/images/learn-2.jpg",
    description:
      "Learn how animals find their way home and navigate the world.",
  },
  {
    id: 3,
    title: "The Toy Maker",
    image: "/images/learn-3.jpg",
    description:
      "Discover how toys are designed, manufactured and brought to life.",
  },
];
export default function LearnPage() {
  return (
    <>
      <Header />

      <main className="learnPage">
        <img
          src="/images/home-hero.png"
          alt=""
          className="learnBg"
        />

        <section className="learnHero">
          <h1>PICK SOMETHING FUN TO LEARN.</h1>
          <p>Learn with Luke Library &gt;</p>
        </section>

        <section className="learnGrid">
          {lessons.map((lesson) => (
            <article className="learnCard" key={lesson.id}>
              <img
                src={lesson.image}
                alt={lesson.title}
                className="learnCardImage"
              />

              <div className="learnCardBody">
                <h2>{lesson.title}</h2>

                <p>{lesson.description}</p>

                <div className="learnCardActions">
                  <button>
                    <img src="/images/heart.png" alt="" />
                  </button>

                  <a href="#" className="learnBtn">
                    LEARN
                  </a>

                  <button>
                    <img src="/images/bookmark.png" alt="" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="suggestBox">
          <input
            placeholder="submit something you want to learn."
          />

          <button>
            <img src="/images/icon-send.png" alt="" />
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}