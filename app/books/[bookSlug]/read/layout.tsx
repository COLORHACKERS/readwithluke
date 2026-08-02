import ReaderGate from "./ReaderGate";

export default function BookReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderGate>{children}</ReaderGate>;
}
