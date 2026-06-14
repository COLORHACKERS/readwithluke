'use client';

import Header from '../../../components/TopHeader';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <Header />

      <div className="flex min-h-[calc(100vh-85px)]">
        {/* LEFT SIDE - Background Color + Text Overlay */}
        <div className="flex-1 relative bg-[#1a2a44] hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1400/900')] bg-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </div>

        {/* RIGHT SIDE - Book Info */}
        <div className="flex-1 bg-white flex flex-col justify-center p-12 lg:p-16">
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
            className="bg-[#d97757] hover:bg-[#c76a4a] text-white text-center py-5 rounded-2xl text-xl font-semibold w-full max-w-sm block"
          >
            Read Story
          </Link>
        </div>
      </div>
    </div>
  );
}