import Link from "next/link";

export default function ReadAlongPage() {
  return (
    <main className="min-h-screen bg-[#ffd21c] px-6 py-6 text-[#071a3a]">
      <Link href="/" className="font-black uppercase">← Back Home</Link>

      <section className="mx-auto max-w-6xl py-12">
        <h1 className="rwl-title text-7xl text-white drop-shadow-[5px_5px_0_#071a3a]">
          READ-ALONG
        </h1>

        <div className="mt-8 rounded-[22px] border-4 border-[#071a3a] bg-white p-6 shadow-[8px_8px_0_#071a3a]">
          <img src="/COVERPHOTO-2.PNG" alt="Story cover" className="rounded-xl border-4 border-[#071a3a]" />
          <button className="mt-6 rounded-xl bg-[#e6442e] px-8 py-4 text-xl font-black text-white shadow-[6px_6px_0_#071a3a]">
            START READ-ALONG
          </button>
        </div>
      </section>
    </main>
  );
}