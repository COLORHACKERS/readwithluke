"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "../../home.css";
import "./rewards.css";

const stickers = ["⭐", "🔥", "📚", "🪙", "🦖", "🚀", "🐸", "🌈"];

export default function RewardsPage() {
  const [childId, setChildId] = useState("");
  const [avatar, setAvatar] = useState("🐸");
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: child } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (child) {
        setChildId(child.id);
        setAvatar(child.avatar || "🐸");
        setSelectedStickers(child.stickers || []);
      }
    }

    load();
  }, []);

  function toggleSticker(sticker: string) {
    setSelectedStickers((current) =>
      current.includes(sticker)
        ? current.filter((item) => item !== sticker)
        : [...current, sticker]
    );
  }

  async function saveAvatar() {
    if (!childId) return;

    const { error } = await supabase
      .from("children")
      .update({
        avatar,
        stickers: selectedStickers,
      })
      .eq("id", childId);

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("Avatar saved!");
  }

  return (
    <>
      <Header />

      <main className="rewardsPage">
        <section className="rewardsCard">
          <div className="avatarPreview">
            <div className="avatarCircle">{avatar}</div>

            <div className="stickerCloud">
              {selectedStickers.map((sticker) => (
                <span key={sticker}>{sticker}</span>
              ))}
            </div>
          </div>

          <div className="avatarBuilder">
            <h1>Build Your Avatar</h1>
            <p>Use stickers you collect while reading.</p>

            <label>Choose Avatar</label>
            <div className="avatarChoices">
              {["🐸", "🦊", "🦖", "🚀", "🐢", "🦉"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={avatar === item ? "selected" : ""}
                  onClick={() => setAvatar(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label>Stickers</label>
            <div className="stickerGrid">
              {stickers.map((sticker) => (
                <button
                  key={sticker}
                  type="button"
                  className={selectedStickers.includes(sticker) ? "selected" : ""}
                  onClick={() => toggleSticker(sticker)}
                >
                  {sticker}
                </button>
              ))}
            </div>

            <button className="saveAvatarButton" onClick={saveAvatar}>
              SAVE AVATAR
            </button>

            {message && <p className="savedMessage">{message}</p>}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
