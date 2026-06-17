import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F1E6] text-[#13294B] flex items-center justify-center p-8">
        <section className="max-w-5xl w-full rounded-[36px] bg-white p-12 shadow-xl text-center">
          <p className="text-[#C6542D] font-black tracking-widest">
            READ WITH LUKE
          </p>

          <h1 className="mt-4 text-6xl md:text-8xl font-black leading-none">
            A story world for brave little readers.
          </h1>

          <p className="mt-6 text-xl max-w-2xl mx-auto opacity-80">
            Read magical books, collect stickers, play puzzles, and build reading
            confidence one adventure at a time.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/books/toy-makers-secret"
              className="rounded-full bg-[#C6542D] px-8 py-4 text-white font-black shadow-[0_8px_0_#8f351d]"
            >
              START READING
            </Link>

            <Link
              href="/library"
              className="rounded-full border-2 border-[#13294B] px-8 py-4 font-black"
            >
              LIBRARY
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}