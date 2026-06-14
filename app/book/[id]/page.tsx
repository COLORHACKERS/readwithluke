'use client';

import Header from '../../../components/TopHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  const book = {
    id: bookId,
    title: "Treehouse Mysteries",
    subtitle: "NEW STORY",
    description: "Luke discovers a glowing key near the old bait shop and follows clues across the harbor.",
    cover: "https://picsum.photos/id/1015/1200/800", // Replace with real image later
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <Header />

      <div className="flex h-[calc(100vh-85px)]">
        {/* Left Side - Big Toy Factory Image (6:5 ratio overall) */}
        <div className="flex-1 relative hidden lg:block">
          <Image
            src="https://picsum.photos/id/1015/1400/900" 
            alt="Toy Maker Factory"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Right Side - Book Information */}
        <div className="flex-1 bg-white flex flex-col justify-center p-12 lg:p-16 max-w-2xl">
          <div className="mb-8">
            <span className="uppercase tracking-widest text-orange-600 font-semibold text-sm">NEW STORY</span>
            <h1 className="text-6xl font-bold leading-tight mt-3 text-[#1a2a44]">
              {book.title}
            </h1>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            {book.description}
          </p>

          <div className="flex items-center gap-4 mb-12">
            <div className="px-6 py-3 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
              Level 1
            </div>
          </div>

          {/* Read Story Button */}
          <Link
            href={`/book/${bookId}/read`}
            className="block w-full bg-[#d97757] hover:bg-[#c76a4a] transition text-white text-center py-5 rounded-2xl text-xl font-semibold shadow-lg"
          >
            Read Story
          </Link>

          <p className="text-center text-sm text-gray-500 mt-8">
            Tap to begin your adventure in the Toy Maker Factory
          </p>
        </div>
      </div>
    </div>
  );
}