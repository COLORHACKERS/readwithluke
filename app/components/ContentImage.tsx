import Image, { type ImageProps } from "next/image";

const storageHost = "elfwdmgutfsdigijpfae.supabase.co";
function canOptimize(src: ImageProps["src"]) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === storageHost && url.pathname.startsWith("/storage/v1/object/public/");
  } catch { return false; }
}
// Unknown third-party images still render; only the known public storage host uses the optimizer.
export default function ContentImage(props: ImageProps) {
  return <Image {...props} alt={props.alt} unoptimized={!canOptimize(props.src)} />;
}
