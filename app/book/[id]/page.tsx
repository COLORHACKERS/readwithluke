'use client';

import Header from '../../components/Header';
import { useState } from 'react';
import { Bookmark, Sun, Moon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookReader() {
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [progress] = useState(45);

  const book = {
    title: "Treehouse Mysteries",
    author: "Luke & Friends"
  };

  const readerClass = 
    theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 
    theme === 'sepia' ? 'bg-[#f4e9d8] text-[#3f2a1e]' : 
    'bg-white text-black';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Main 6:5 Reader Area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-85px)] p-6 bg-[#0a0a0a]">
        <div className="w-full max-w-[1180px] aspect-[6/5] bg-[#f8f1e3] rounded-3xl overflow-hidden border-[16px] border-amber-950 shadow-2xl relative">
          
          {/* Book Content */}
          <div className={`h-full overflow-auto p-12 md:p-16 ${readerClass} transition-all`}>
            <div className="max-w-3xl mx-auto pt-8">
              <h1 className="text-center text-5xl font-bold mb-6 tracking-tight">{book.title}</h1>
              <p className="text-center text-xl text-gray-600 mb-12">by {book.author}</p>

              <div 
                className="prose prose-lg leading-relaxed mx-auto"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
              >
                <p>In the heart of the grand Toy Maker Factory, sunlight streamed through the vast glass ceiling as conveyor belts hummed with life. Little robots and teddy bears worked side by side creating joy.</p>
                <p>Luke discovers a glowing key near the old bait shop and follows clues across the harbor. What magical adventures await in the Treehouse Mysteries?</p>
              </div>
            </div>
          </div>

          {/* Progress Bar (Conveyor Style) */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-900/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/80 backdrop-blur-md px-10 py-4 rounded-2xl text-white text-sm border border-white/10">
            <button className="flex items-center gap-2 hover:text-amber-400 transition">← Prev</button>
            <div className="px-8 border-x border-white/20">Page 1 of 42</div>
            <button className="flex items-center gap-2 hover:text-amber-400 transition">Next →</button>
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
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