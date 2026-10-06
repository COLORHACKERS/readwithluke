import Image, { type ImageProps } from "next/image";

// Serve existing artwork directly, including animated covers.
// This avoids the failing deployment image-optimization endpoint.
export default function ContentImage(props: ImageProps) {
  return <Image {...props} alt={props.alt} unoptimized />;
}
