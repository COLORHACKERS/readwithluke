import ReaderGate from "../books/[bookSlug]/read/ReaderGate";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderGate>{children}</ReaderGate>;
}
