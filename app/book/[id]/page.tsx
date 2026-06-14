'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Simple Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div className="font-bold text-2xl">READ WITH LUKE</div>
          </div>
          <nav className="flex gap-8 text-lg">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <Link href="/library" className="text-orange-600 font-semibold">Library</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
              🔥 12
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-85px)]">
        {/* Left - Big Image */}
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

        {/* Right - Book Info */}
        <div className="flex-1 bg-white p-12 lg:p-16 flex flex-col justify-center">
          <span className="uppercase tracking-widest text-orange-600 font-semibold text-sm">NEW STORY</span>
          
          <h1 className="text-6xl font-bold mt-4 mb-6 leading-tight text-[#1a2a44]">
            TREEHOUSE MYSTERIES
          </h1>

          <p className="text-xl text-gray-700 mb-12 max-w-md">
            Luke discovers a glowing key near the old bait shop and follows clues across the harbor.
          </p>

          <div className="mb-12">
            <span className="px-6 py-3 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
              Level 1
            </span>
          </div>

          <Link
            href={`/book/${bookId}/read`}
            className="bg-[#d97757] hover:bg-[#c76a4a] text-white text-center py-5 rounded-2xl text-xl font-semibold w-full max-w-sm"
          >
            Read Story
          </Link>
        </div>
      </div>
    </div>
  );
}