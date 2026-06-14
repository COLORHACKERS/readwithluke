import SiteHeader from "../../../components/header";

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#fff7df]">
      <SiteHeader/>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center">
        <div className="rounded-[2rem] border-4 border-black bg-white p-8 shadow-[6px_6px_0_#000]">
          <div className="text-6xl">🎮</div>
          <h1 className="mt-4 text-4xl font-black">Games</h1>
          <p className="mt-4 text-lg font-bold text-black/70">
            Coming soon.
          </p>
        </div>
      </section>
    </main>
  );
}