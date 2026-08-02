import ReaderGate from "@/app/components/ReaderGate";

export default function BookReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderGate>{children}</ReaderGate>;
}
