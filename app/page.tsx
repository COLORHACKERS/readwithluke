'use client';

import Header from '../components/TopHeader';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const books = [
    { id: 1, title: "The Mystery Key", level: 1, progress: 20, cover: "https://picsum.photos/id/1015/400/280", new: true },
    { id: 2, title: "Lost in the Rain", level: 2, progress: 0, cover: "https://picsum.photos/id/102/400/280", new: true },
    { id: 3, title: "The Hidden Lighthouse", level: 3, progress: 0, cover: "https://picsum.photos/id/133/400/280" },
    { id: 4, title: "The Forgotten Map", level: 4, progress: 0, cover: "https://picsum.photos/id/201/400/280" },
    { id: 5, title: "The Secret Cave", level: 5, progress: 0, cover: "https://picsum.photos/id/251/400/280" },
    { id: 6, title: "The Brave Discovery", level: 6, progress: 0, cover: "https://picsum.photos/id/180/400/280" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      <Header />

      {/* Beautiful Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://picsum.photos/id/1015/1920/1080"
          alt="Toy Factory Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
      </div>

      <div className="relative z-10 px-8 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold tracking-tight mb-3">Your Library</h1>
          <p className="text-xl text-white/80 mb-10">Choose a story and keep your adventure going.</p>

          {/* Tabs */}
          <div className="flex gap-3 mb-10">
            <button className="px-8 py-3 bg-amber-400 text-black rounded-2xl font-semibold flex items-center gap-2">
              📚 All Books
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-medium flex items-center gap-2 transition">
              ▶️ In Progress
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-medium flex items-center gap-2 transition">
              ✅ Completed
            </button>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Link 
                key={book.id} 
                href={`/book/${book.id}`}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all hover:-translate-y-2"
              >
                <div className="relative">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={400}
                    height={280}
                    className="w-full aspect-[4/2.8] object-cover"
                  />
                  {book.new && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">New</div>
                  )}
                </div>

                <div className="p-6">
                  <div className="font-semibold text-lg mb-1">{book.title}</div>
                  <div className="text-amber-400 text-sm mb-4">Level {book.level}</div>

                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60 mt-2">
                    {book.progress}% Complete
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}