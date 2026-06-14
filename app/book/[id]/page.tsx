"use client";

import Header from "../../../components/TopHeader";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8f1e6] overflow-hidden">
      <Header />

      <main className="grid min-h-[calc(100vh-85px)] grid-cols-1 lg:grid-cols-[60.5%_39.5%] border-t border-[#1b1b1b]/25">
        <section className="relative min-h-[520px] lg:min-h-[calc(100vh-85px)]">
          <Image
            src="/images/toy-maker-factory.png"
            alt="Toy Maker Factory"
            fill
            className="object-cover"
            priority
          />
        </section>

        <section className="bg-[#f8f1e6] flex items-start justify-center px-10 py-12 lg:px-14 lg:py-14">
          <div className="w-full max-w-[520px] pt-4">
            <p className="mb-6 text-[24px] font-black uppercase tracking-[0.08em] text-[#c6542d]">
              New Story
            </p>

            <h1 className="mb-8 text-[52px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#13294b] lg:text-[64px]">
              Treehouse <br />
              Mysteries
            </h1>

            <p className="mb-10 max-w-[430px] text-[24px] font-extrabold leading-[1.35] text-[#13294b]">
              Luke discovers a glowing key near the old bait shop and follows
              clues across the harbor.
            </p>

            <Link
              href={`/book/${bookId}/read`}
              className="block w-full rounded-[18px] bg-[#c6542d] px-10 py-6 text-center text-[22px] font-black text-white transition hover:bg-[#ad4525]"
            >
              Read Story
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}