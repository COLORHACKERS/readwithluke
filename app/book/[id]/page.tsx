'use client';

import Image from 'next/image';
import { ArrowLeft, Flame } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  // Mock book data - later we'll fetch from Supabase
  const book = {
    id: bookId,
    title: "Treehouse Mysteries",
    subtitle: "NEW STORY",
    description: "Luke discovers a glowing key near the old bait shop and follows clues across the harbor.",
    cover: "https://picsum.photos/id/1015/1200/800", // Replace with real image later
    level: 1,
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] overflow-hidden">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b bg-white/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            📖 <span>READ WITH LUKE</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <Link href="/library" className="text-amber-600 font-semibold">Library</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
            <Flame size={20} /> 12
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400">
            <Image src="https://picsum.photos/id/64/128/128" alt="Profile" width={36} height={36} />
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-85px)]">
        {/* Left Side - Big Toy Factory Image */}
        <div className="flex-1 relative hidden lg:block">
          <Image
            src="https://picsum.photos/id/1015/1400/900" // ← Replace this with your real Toy Factory image
            alt="Toy Maker Factory"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Right Side - Book Info */}
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
              Level {book.level}
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