"use client";

type Props = {
  title: string;
  text: string;
  url: string;
};

export default function ShareButton({
  title,
  text,
  url,
}: Props) {
  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : url;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  }

  return (
    <button onClick={handleShare}>
      <img src="/images/share.png" alt="Share" />
    </button>
  );
}