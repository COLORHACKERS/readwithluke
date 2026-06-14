"use client";

import Header from "../../../components/TopHeader";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Settings, Bookmark, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookReader({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [progress] = useState(42);

  useEffect(() => {
    setBook({
      id: params.id,
      title: "The Toy Maker's Adventure",
      author: "Luke & Friends",
      content: `In the heart of the grand Toy Maker Factory, sunlight streamed through the vast glass ceiling as conveyor belts hummed with life. Little robots and teddy bears worked together creating joy...\n\nThis is where your full book content will go. We'll load real books from Supabase later.`,
    });
  }, [params.id]);

  if (!book) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading magical story...</div>;

  const readerClass = theme === 'dark' 
    ? 'bg-zinc-950 text-zinc-100' 
    : theme === 'sepia' 
    ? 'bg-[#f4e9d8] text-[#3f2a1e]' 
    : 'bg-white text-black';

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative font-serif">
      {/* Background Image - Toy Factory */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/id/1015/1920/1080" 
          alt="Toy Factory"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <button className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors">
          <ArrowLeft size={24} />
          <span>Library</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">{book.title}</h1>
          <p className="text-white/70 text-sm">by {book.author}</p>
        </div>

        <button className="text-white hover:text-amber-400"><Settings size={24} /></button>
      </header>

      {/* Main Reader - 6:5 Ratio */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-85px)] p-6">
        <div className="w-full max-w-[1200px] aspect-[6/5] bg-[#f8f1e3] rounded-3xl overflow-hidden border-[14px] border-amber-950 shadow-2xl relative">
          
          {/* Book Content */}
          <div className={`h-full overflow-auto p-12 md:p-20 ${readerClass} transition-colors`}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-center text-4xl font-bold mb-12 tracking-wide">Chapter 1</h2>
              
              <div 
                className="prose prose-lg leading-relaxed"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
              >
                {book.content.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="mb-8">{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-900/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Page Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/80 backdrop-blur-md px-10 py-4 rounded-2xl text-white text-sm border border-white/10">
            <button className="flex items-center gap-2 hover:text-amber-400 transition">← Prev</button>
            <div className="px-8 border-x border-white/20">Page 12 of 87</div>
            <button className="flex items-center gap-2 hover:text-amber-400 transition">Next →</button>
          </div>
        </div>
      </div>

      {/* Floating Reader Controls */}
      <div className="fixed bottom-8 right-8 z-20 flex flex-col gap-3">
        <div className="bg-black/90 backdrop-blur-2xl p-5 rounded-3xl flex flex-col gap-5 text-white shadow-2xl border border-white/10">
          <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="text-2xl hover:scale-110 transition">A+</button>
          <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="text-2xl hover:scale-110 transition">A−</button>
          
          <div className="h-px bg-white/20 my-1" />
          
          <button 
            onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')} 
            className="hover:scale-110 transition"
          >
            {theme === 'dark' ? <Sun size={26} /> : <Moon size={26} />}
          </button>
          
          <button className="hover:scale-110 transition"><Bookmark size={26} /></button>
        </div>
      </div>
    </div>
  );
}