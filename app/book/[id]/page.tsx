'use client';

import Header from '../../../components/TopHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <Header />

      <div className="flex h-[calc(100vh-85px)]">
        {/* LEFT: Big Toy Factory Image */}
        <div className="flex-1 relative hidden lg:block">
          <Image
            src="https://picsum.photos/id/1015/1400/900" 
            alt="Toy Maker Factory"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* RIGHT: Book Info */}
        <div className="flex-1 bg-white flex flex-col justify-center p-10 lg:p-16 max-w-2xl">
          <span className="uppercase tracking-[3px] text-orange-600 font-semibold text-sm">NEW STORY</span>
          
          <h1 className="text-6xl font-bold leading-none mt-4 mb-6 text-[#1e2a44]">
            TREEHOUSE MYSTERIES
          </h1>

          <p className="text-2xl text-gray-700 leading-tight mb-10">
            Luke discovers a glowing key near the old bait shop and follows clues across the harbor.
          </p>

          <div className="mb-10">
            <span className="inline-block px-6 py-2 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
              Level 1
            </span>
          </div>

          <Link
            href={`/book/${bookId}/read`}
            className="inline-block w-full max-w-md bg-[#d97757] hover:bg-[#c76a4a] text-white text-center py-5 rounded-2xl text-xl font-semibold shadow-lg transition"
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