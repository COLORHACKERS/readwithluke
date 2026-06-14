'use client';

import Header from '../../../components/TopHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const params = useParams();
  const bookId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Centered 6:5 Container */}
      <div className="flex items-center justify-center min-h-[calc(100vh-85px)] p-6">
        <div className="w-full max-w-[1200px] aspect-[6/5] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative">
          
          <div className="flex h-full">
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
            <div className="flex-1 flex flex-col justify-center p-10 lg:p-16">
              <span className="uppercase tracking-widest text-orange-600 font-semibold text-sm">NEW STORY</span>
              
              <h1 className="text-6xl font-bold mt-6 mb-6 leading-tight text-[#1a2a44]">
                TREEHOUSE MYSTERIES
              </h1>

              <p className="text-xl text-gray-700 mb-12">
                Luke discovers a glowing key near the old bait shop and follows clues across the harbor.
              </p>

              <div className="mb-12">
                <span className="px-6 py-3 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
                  Level 1
                </span>
              </div>

              <Link
                href={`/book/${bookId}/read`}
                className="bg-[#d97757] hover:bg-[#c76a4a] text-white text-center py-5 rounded-2xl text-xl font-semibold block w-full max-w-sm"
              >
                Read Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}