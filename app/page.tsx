import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F1E6] text-[#13294B]">
        <section className="mx-auto max-w-[1600px] px-8 py-12">
          <div className="rounded-[40px] bg-white p-12 shadow-xl">
            <p className="text-[#C6542D] font-black tracking-[0.25em] uppercase">
              Read With Luke
            </p>

            <h1 className="mt-4 text-5xl md:text-7xl font-black leading-[0.9]">
              Read.
              <br />
              Learn.
              <br />
              Explore.
            </h1>

            <p className="mt-6 max-w-2xl text-xl opacity-80">
              Books, learning activities, puzzles, and adventures designed for
              curious young minds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/library"
                className="rounded-full bg-[#C6542D] px-8 py-4 text-white font-black"
              >
                READ STORIES
              </Link>

              <Link
                href="/learn"
                className="rounded-full border-2 border-[#13294B] px-8 py-4 font-black"
              >
                LEARN WITH LUKE
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Link
              href="/library"
              className="group overflow-hidden rounded-[36px] bg-white shadow-lg"
            >
              <img
                src="/images/library-cover.jpg"
                alt="Library"
                className="h-[500px] w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="p-8">
                <p className="text-[#C6542D] font-black uppercase tracking-widest">
                  STORIES
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  Story Library
                </h2>

                <p className="mt-4 opacity-70">
                  Magical adventures, mysteries, animals, bedtime stories and more.
                </p>
              </div>
            </Link>

            <Link
              href="/learn"
              className="group overflow-hidden rounded-[36px] bg-white shadow-lg"
            >
              <img
                src="/images/learn-cover.jpg"
                alt="Learn With Luke"
                className="h-[500px] w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="p-8">
                <p className="text-[#C6542D] font-black uppercase tracking-widest">
                  LEARNING
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  Learn With Luke
                </h2>

                <p className="mt-4 opacity-70">
                  Phonics, numbers, shapes, animals, colors and fun educational activities.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}