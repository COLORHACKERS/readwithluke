'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Flame, Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[#f8f5f0] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-4xl">📖</div>
          <div className="font-bold text-3xl tracking-tight">
            READ <span className="text-orange-500">WITH</span> LUKE
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-10 text-lg">
          <Link href="/" className="flex items-center gap-2 hover:text-orange-600 transition">
            <Home size={24} />
            Home
          </Link>
          <Link href="/library" className="hover:text-orange-600 transition">Library</Link>
          <Link href="/progress" className="hover:text-orange-600 transition">My Progress</Link>
          <Link href="/quests" className="hover:text-orange-600 transition">Quests</Link>
          <Link href="/rewards" className="hover:text-orange-600 transition">Rewards</Link>
        </nav>

        {/* Right Side - Flame + Avatar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2.5 rounded-3xl font-medium">
            <Flame size={26} />
            <span className="text-xl font-bold">12</span>
          </div>

          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-orange-400 shadow-sm">
            <Image 
              src="https://picsum.photos/id/64/128/128" 
              alt="Luke" 
              width={44} 
              height={44} 
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}