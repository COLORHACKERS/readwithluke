"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
type Props = { title: string; text: string; url: string };
export default function ShareButton({ title, text, url }: Props) {
  const [message, setMessage] = useState("");
  async function handleShare() {
    const shareUrl = new URL(url, window.location.origin).toString();
    setMessage("");
    if (navigator.share) {
      try { await navigator.share({ title, text, url: shareUrl }); return; }
      catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(shareUrl); setMessage("Link copied!"); }
    catch { setMessage("Copy the address from your browser to share this adventure."); }
  }
  return <><button type="button" onClick={handleShare} aria-label={`Share ${title}`}><Share2 aria-hidden="true" size={20} color="#123a60" /></button><span role="status" aria-live="polite" style={{ marginLeft: 12, fontSize: 13 }}>{message}</span></>;
}
