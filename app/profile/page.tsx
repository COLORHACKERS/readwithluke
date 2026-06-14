import Link from "next/link";
import SiteHeader from "@/app/components/header";
export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#ffd21c] px-6 py-6 text-[#071a3a]">
      <Link href="/" className="font-black uppercase">← Back Home</Link>

      <section className="mx-auto max-w-5xl py-12">
        <h1 className="rwl-title text-7xl text-white drop-shadow-[5px_5px_0_#071a3a]">
          PROFILE
        </h1>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card title="Stories Read" value="0" />
          <Card title="Stickers Earned" value="0" />
          <Card title="Reading Streak" value="0 Days" />
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[18px] border-4 border-[#071a3a] bg-white p-7 shadow-[8px_8px_0_#071a3a]">
      <p className="font-black uppercase text-[#e6442e]">{title}</p>
      <h2 className="mt-3 text-5xl font-black">{value}</h2>
    </div>
  );
}