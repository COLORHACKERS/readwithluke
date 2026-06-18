"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";

function getTimeLeft() {
  const trialStart = new Date(2026, 5, 20, 0, 0, 0);
  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + 90);

  const now = new Date();
  const target = now < trialStart ? trialStart : trialEnd;
  const diff = Math.max(target.getTime() - now.getTime(), 0);

  return {
    label: now < trialStart ? "FREE TRIAL STARTS IN" : "YOUR FREE TRIAL ENDS IN",
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F1E6] text-[#13294B]">
        <section className="mx-auto max-w-[1500px] px-8 py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-black uppercase tracking-[0.28em] text-[#C6542D]">
                Read With Luke Soft Launch
              </p>

              <h1 className="mt-5 text-6xl font-black leading-[0.9] md:text-8xl">
                Stories Today.
                <br />
                <span className="text-[#C6542D]">Curiosity Forever.</span>
              </h1>

              <p className="mt-6 max-w-xl text-2xl font-bold leading-snug">
                Magical stories, fascinating facts, and fun adventures that
                inspire curious kids.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/library"
                  className="rounded-full bg-[#C6542D] px-8 py-4 text-lg font-black text-white shadow-[0_8px_0_#8f351d]"
                >
                  READ STORIES
                </Link>

                <Link
                  href="/learn"
                  className="rounded-full border-2 border-[#13294B] px-8 py-4 text-lg font-black"
                >
                  LEARN WITH LUKE
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[40px] bg-white shadow-xl">
              <img
                src="/images/6to5ratio.png"
                alt="Luke reading"
                className="h-[520px] w-full object-cover"
              />
            </div>
          </div>

          <section className="mt-10 overflow-hidden rounded-[40px] border-4 border-[#F5B51B] bg-[#07265A] p-8 text-white shadow-2xl">
            <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr_260px]">
              <div className="text-8xl">🚀</div>

              <div>
                <p className="inline-block rounded-full bg-[#F5B51B] px-5 py-2 text-sm font-black uppercase tracking-widest text-[#13294B]">
                  Soft Launch
                </p>

                <h2 className="mt-5 text-5xl font-black leading-none">
                  START YOUR FREE TRIAL
                </h2>

                <p className="mt-4 max-w-2xl text-xl font-bold">
                  We’re in soft launch! Support us as we work towards our grand
                  launch.
                </p>

                <div className="mt-7 rounded-[24px] border border-[#F5B51B] bg-[#031A42] p-5">
                  <p className="mb-4 text-center text-sm font-black uppercase tracking-widest text-[#F5B51B]">
                    {timeLeft.label}
                  </p>

                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      ["Days", timeLeft.days],
                      ["Hours", timeLeft.hours],
                      ["Minutes", timeLeft.minutes],
                      ["Seconds", timeLeft.seconds],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-[#092E6D] p-4">
                        <div className="text-4xl font-black text-[#F5B51B]">
                          {String(value).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-xs font-black uppercase">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/library"
                  className="mt-7 inline-flex rounded-full bg-[#C6542D] px-9 py-4 text-lg font-black text-white shadow-[0_8px_0_#8f351d]"
                >
                  START YOUR FREE TRIAL →
                </Link>
              </div>

              <div className="rounded-full bg-[#FFE2A3] p-8 text-center text-[#13294B]">
                <p className="text-sm font-black uppercase">Trial Starts</p>
                <p className="mt-2 text-2xl font-black">June 20, 2026</p>
                <p className="font-black">12:00 AM</p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-center text-4xl font-black">
              Explore. Learn. Grow.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-5">
              {[
                ["📖", "Read", "Enjoy exciting stories that spark imagination."],
                ["🪐", "Learn", "Discover cool things like why astronauts wear suits in space."],
                ["⭐", "Stickers", "Collect rewards as you read and learn."],
                ["📈", "Progress", "Track growth and celebrate wins."],
                ["🎁", "Rewards", "Unlock surprises for hard work."],
              ].map(([icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-[28px] bg-white p-7 text-center shadow-lg"
                >
                  <div className="text-6xl">{icon}</div>
                  <h3 className="mt-4 text-2xl font-black">{title}</h3>
                  <p className="mt-3 font-bold opacity-75">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[32px] bg-white p-8 shadow-lg">
              <h3 className="text-3xl font-black">Hey there! I’m Luke.</h3>
              <p className="mt-4 text-lg font-bold leading-relaxed opacity-80">
                I created Read With Luke to make reading exciting, learning fun,
                and growing up curious something every kid can enjoy.
              </p>
              <p className="mt-4 font-black text-[#C6542D]">— Luke</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-lg">
              <h3 className="text-3xl font-black">Support Our Mission</h3>
              <p className="mt-4 text-lg font-bold leading-relaxed opacity-80">
                We’re a small team with a big dream — to help every child build
                confidence, curiosity, and a love for learning.
              </p>
              <p className="mt-4 font-black text-[#C6542D]">
                Thank you for supporting us as we work towards our grand launch!
              </p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}