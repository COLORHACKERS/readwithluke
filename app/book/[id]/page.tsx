'use client';

import Header from '../../../components/TopHeader';

export default function BookDetail() {
  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <Header />

      <div className="flex h-[calc(100vh-85px)]">
        {/* LEFT - Image */}
        <div className="flex-1 relative hidden lg:block">
          <img 
            src="https://picsum.photos/id/1015/1400/900" 
            alt="Toy Maker Factory" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* RIGHT - Content */}
        <div className="flex-1 p-12 lg:p-20 flex items-center">
          <div>
            <p className="uppercase text-orange-600 font-bold tracking-widest mb-3">NEW STORY</p>
            
            <h1 className="text-6xl font-bold leading-none mb-8">TREEHOUSE MYSTERIES</h1>

            <p className="text-xl text-gray-700 mb-10 max-w-md">
              Luke discovers a glowing key near the old bait shop and follows clues across the harbor.
            </p>

            <div className="mb-10">
              <span className="px-6 py-3 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
                Level 1
              </span>
            </div>

            <button className="bg-[#d97757] hover:bg-[#c76a4a] text-white px-12 py-5 rounded-2xl text-xl font-semibold">
              Read Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}