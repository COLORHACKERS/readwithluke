'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Settings, Bookmark, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookReader({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [progress, setProgress] = useState(42);

  // Mock book data (we'll connect to Supabase later)
  useEffect(() => {
    setBook({
      id: params.id,
      title: "The Toy Maker's Adventure",
      author: "Luke & Friends",
      content: `In the heart of the grand Toy Maker Factory, where sunlight streamed through the glass ceiling and conveyor belts hummed with joy, a little robot named Spark watched in wonder as teddy bears and toy trains came to life...\n\nChapter 1 continued with more magical content here. You can replace this with real book text later.`,
    });
  }, [params.id]);

  if (!book) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-white">Loading your story...</div>;
  }

  const readerClass = 
    theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 
    theme === 'sepia' ? 'bg-[#f4e9d8] text-[#3f2a1e]' : 
    'bg-white text-black';

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative font-serif">
      {/* Toy Factory Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/id/1015/1920/1080" // Replace with your toy factory image later
          alt="Toy Factory"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md px-6 py-4">
        <button className="flex items-center gap-2 text-white hover:text-amber-400">
          <ArrowLeft size={22} />
          Back to Library
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{book.title}</h1>
          <p className="text-sm text-white/60">by {book.author}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full text-white">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Reader Area - 6:5 Ratio */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-85px)] p-8">
        <div className="w-full max-w-[1180px] aspect-[6/5] bg-[#f8f1e3] shadow-2xl rounded-3xl overflow-hidden border-8 border-amber-950 relative">
          
          {/* Content Area */}
          <div className={`h-full overflow-auto p-12 md:p-16 ${readerClass} transition-all`}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-center text-4xl font-bold mb-12">Chapter 1</h2>
              
              <div 
                className="prose leading-relaxed"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              >
                {book.content.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="mb-6">{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar (Conveyor style) */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-900/40">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Page Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/70 backdrop-blur-md px-8 py-3 rounded-2xl text-white text-sm">
            <button className="flex items-center gap-1 hover:text-amber-400 transition">
              <ChevronLeft /> Prev
            </button>
            <div className="px-6 border-x border-white/30">Page 7 of 42</div>
            <button className="flex items-center gap-1 hover:text-amber-400 transition">
              Next <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 z-20 flex flex-col gap-3">
        <div className="bg-black/90 backdrop-blur-xl p-5 rounded-3xl flex flex-col gap-4 text-white shadow-2xl border border-white/10">
          <button onClick={() => setFontSize(s => Math.min(26, s + 2))} className="hover:scale-110 transition">A+</button>
          <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="hover:scale-110 transition">A−</button>
          
          <div className="h-px bg-white/20" />
          
          <button onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')} className="hover:scale-110 transition">
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          <button className="hover:scale-110 transition"><Bookmark size={22} /></button>
        </div>
      </div>
    </div>
  );
}